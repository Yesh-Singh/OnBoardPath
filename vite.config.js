import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const geminiAssistantPlugin = (apiKey) => {
  const requestGemini = async (prompt, maxOutputTokens = 512) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`
    const retryableStatuses = new Set([429, 500, 502, 503, 504])

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
        if (response.ok || !retryableStatuses.has(response.status) || attempt === 2) {
          return response
        }
      } catch (error) {
        if (attempt === 2) throw error
      } finally {
        clearTimeout(timeout)
      }
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
    }
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

    if (!apiKey) {
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
      response.end(JSON.stringify({ status: 'working', message: 'Gemini API key is working' }))
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

    if (!apiKey) {
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
  const { GEMINI_API_KEY } = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), geminiAssistantPlugin(GEMINI_API_KEY)],
  }
})
