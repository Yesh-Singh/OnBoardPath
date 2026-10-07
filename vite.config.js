import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Try the newest model first, then fall back to older ones. Free-tier quota is
// tracked per model, so exhausting one model's quota should not break the app.
const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite']

const geminiAssistantPlugin = (apiKeys) => {
  // Index of the model that answered successfully most recently.
  let preferredModel = 0
  // Index of the key that answered successfully most recently.
  let preferredKey = 0

  // Runs the model fallback chain against a single key. Returns
  // { response, rotateKey }; rotateKey: true means the key itself is the
  // problem (invalid key or account-wide quota) and the caller should retry
  // with the next key.
  const requestWithKey = async (key, prompt, maxOutputTokens) => {
    const retryableStatuses = new Set([500, 502, 503, 504])
    const modelOrder = [
      ...GEMINI_MODELS.slice(preferredModel),
      ...GEMINI_MODELS.slice(0, preferredModel)
    ]
    let lastResponse = null
    let sawQuotaError = false

    for (const model of modelOrder) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 20000)
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens }
            }),
            signal: controller.signal
          })

          if (response.ok) {
            preferredModel = GEMINI_MODELS.indexOf(model)
            return { response, rotateKey: false }
          }

          // Key-level failures: an invalid/revoked key fails identically for
          // every model, so switch keys immediately instead of burning the list.
          // Google reports a bad key as 400 API_KEY_INVALID (not 401).
          if (response.status === 401 || response.status === 403) {
            return { response, rotateKey: true }
          }
          if (response.status === 400) {
            let reason = ''
            try {
              const body = await response.clone().json()
              reason = body?.error?.details?.[0]?.reason || ''
            } catch {
              // Not a JSON body: treat as an ordinary client error.
            }
            if (reason === 'API_KEY_INVALID') return { response, rotateKey: true }
          }

          if (response.status === 429) sawQuotaError = true

          if (!retryableStatuses.has(response.status)) {
            // 404 (retired model) or 429 (quota exhausted): move to the next model.
            // Any other status is unrelated to the key and fails for every model.
            if (response.status !== 404 && response.status !== 429) return { response, rotateKey: false }
            lastResponse = response
            break
          }

          lastResponse = response
          if (attempt === 2) break
        } catch (error) {
          if (attempt === 2) throw error
        } finally {
          clearTimeout(timeout)
        }
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
      }
    }

    // Every model failed. Rotate keys only when quota errors suggest the key's
    // account is the bottleneck (a second key has its own separate quota).
    return { response: lastResponse, rotateKey: Boolean(lastResponse && sawQuotaError) }
  }

  const requestGemini = async (prompt, maxOutputTokens = 512) => {
    let lastResponse = null
    let lastError = null

    for (let attempt = 0; attempt < apiKeys.length; attempt += 1) {
      const keyIndex = (preferredKey + attempt) % apiKeys.length
      let outcome
      try {
        outcome = await requestWithKey(apiKeys[keyIndex], prompt, maxOutputTokens)
      } catch (error) {
        // Network/timeout error on this key: still give the backup key a shot.
        lastError = error
        continue
      }

      const { response, rotateKey } = outcome
      if (response?.ok) {
        preferredKey = keyIndex // remember the key that worked for next time
        return response
      }
      if (response && !rotateKey) return response
      if (response) lastResponse = response
    }

    if (lastResponse) return lastResponse
    if (lastError) throw lastError
    throw new Error('Gemini request exhausted retries')
  }

  const handleHealthRequest = async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    response.setHeader('Cache-Control', 'no-store')

    if (request.method !== 'GET') {
      response.statusCode = 405
      response.setHeader('Allow', 'GET')
      response.end(JSON.stringify({ status: 'unavailable', message: 'Method not allowed' }))
      return
    }

    if (apiKeys.length === 0) {
      response.statusCode = 503
      response.end(JSON.stringify({ status: 'not_configured', message: 'Gemini API key is not configured' }))
      return
    }

    try {
      const geminiResponse = await requestGemini('Reply with the single word OK.', 5)
      if (!geminiResponse.ok) {
        response.statusCode = 502
        response.end(JSON.stringify({ status: 'unavailable', message: 'Gemini chat completion failed' }))
        return
      }
      response.end(JSON.stringify({ status: 'working', message: 'Gemini API key is working', keysConfigured: apiKeys.length }))
    } catch {
      response.statusCode = 502
      response.end(JSON.stringify({ status: 'unavailable', message: 'Gemini could not be reached' }))
    }
  }

  const handleAssistantRequest = async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    response.setHeader('Cache-Control', 'no-store')

    if (request.method !== 'POST') {
      response.statusCode = 405
      response.setHeader('Allow', 'POST')
      response.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }

    let requestBody = ''
    for await (const chunk of request) requestBody += chunk

    let prompt
    try {
      ({ prompt } = JSON.parse(requestBody))
    } catch {
      response.statusCode = 400
      response.end(JSON.stringify({ error: 'Invalid request body' }))
      return
    }

    if (typeof prompt !== 'string' || !prompt.trim()) {
      response.statusCode = 400
      response.end(JSON.stringify({ error: 'A prompt is required' }))
      return
    }

    if (prompt.length > 8000) {
      response.statusCode = 413
      response.end(JSON.stringify({ error: 'Prompt is too long' }))
      return
    }

    if (apiKeys.length === 0) {
      response.statusCode = 503
      response.end(JSON.stringify({ error: 'Gemini is not configured' }))
      return
    }

    try {
      const geminiResponse = await requestGemini(prompt)

      if (!geminiResponse.ok) {
        response.statusCode = 502
        response.end(JSON.stringify({ error: 'Gemini request failed' }))
        return
      }

      const data = await geminiResponse.json()
      const reply = data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim()
      if (typeof reply !== 'string' || !reply.trim()) {
        response.statusCode = 502
        response.end(JSON.stringify({ error: 'Gemini returned no reply' }))
        return
      }

      response.end(JSON.stringify({ reply: reply.trim() }))
    } catch {
      response.statusCode = 502
      response.end(JSON.stringify({ error: 'Gemini request failed' }))
    }
  }

  return {
    name: 'onboardpath-gemini-assistant',
    configureServer(server) {
      server.middlewares.use('/api/assistant/health', handleHealthRequest)
      server.middlewares.use('/api/assistant', handleAssistantRequest)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/assistant/health', handleHealthRequest)
      server.middlewares.use('/api/assistant', handleAssistantRequest)
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Primary key, optional backup key(s). Each variable may also hold a
  // comma-separated list, and every key needs its own quota, so the backup
  // should come from a different Google account.
  const apiKeys = `${env.GEMINI_API_KEY || ''},${env.GEMINI_API_KEY_BACKUP || ''}`
    .split(',')
    .map(key => key.trim())
    .filter(Boolean)

  return {
    plugins: [react(), tailwindcss(), geminiAssistantPlugin(apiKeys)],
  }
})
