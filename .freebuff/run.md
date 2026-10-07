# OnboardPath — run instructions

## 1. Reproduce the uncommitted artifacts

Fresh checkout needs these steps (values are never recorded here — only procedures):

1. **Install JS dependencies** (project uses npm; `package-lock.json` is committed):
   ```
   npm ci        # or: npm install
   ```
2. **Copy `.env.local` from the main checkout** into this worktree (no-op when workspace == checkout). It must define two variables (names only, obtain values from aistudio.google.com/apikey — use a different Google account per key so each has its own quota):
   - `GEMINI_API_KEY` — primary Gemini key
   - `GEMINI_API_KEY_BACKUP` — backup key used automatically when the primary fails (invalid key / account-wide quota)
3. **Python ML sidecar dependencies** (for checklist AI priorities):
   ```
   python -m pip install -r "ai model/requirements.txt"
   ```
   Use the Python 3.11 install directly (`C:\Users\yeshs\AppData\Local\Programs\Python\Python311\python.exe`); the `py` launcher on this machine is broken (points at a missing 3.14).

No build step is required for dev — Vite transpiles on the fly. `npm run build` produces `dist/` for `npm run preview`.

## 2. Run the server

Default Vite port 5173 is usually taken by another project on this machine, so run on **5175 with `--strictPort`**.

### Web app (detached — survives the conversation)

PowerShell (logs must be two DIFFERENT files):

```
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--port','5175','--strictPort' -RedirectStandardOutput '<repo>\.freebuff\preview-<id>.log' -RedirectStandardError '<repo>\.freebuff\preview-<id>.log.err' -WindowStyle Hidden -PassThru).Id"
```

- Confirm: `powershell -NoProfile -Command "Get-Process -Id <pid>"`, then `curl http://localhost:5175/` → 200.
- Health of the Gemini middleware: `GET http://localhost:5175/api/assistant/health` → `{"status":"working","keysConfigured":2}`.

### Python ML sidecar on 127.0.0.1:8000 (checklist priorities)

```
powershell -NoProfile -Command "(Start-Process -FilePath 'python.exe' -ArgumentList '-m','uvicorn','api:app','--host','127.0.0.1','--port','8000' -WorkingDirectory '<repo>\ai model' -RedirectStandardOutput '<repo>\.freebuff\uvicorn.log' -RedirectStandardError '<repo>\.freebuff\uvicorn.log.err' -WindowStyle Hidden -PassThru).Id"
```

- First boot loads TensorFlow and can take several minutes — start it well before a demo.
- Health: `GET http://127.0.0.1:8000/health` → `{"status":"ok",...}`.
- If it is down, the checklist still renders; only the per-task High/Medium/Low badges are omitted (browser shows connection-refused console errors meanwhile).

### Stop

`taskkill /PID <pid> /T /F` for each server (PowerShell: `Stop-Process -Id <pid> -Force`).
