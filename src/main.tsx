import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<div style="color:red;padding:20px">Error: #root element not found</div>'
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (err) {
    rootEl.innerHTML = `<div style="color:red;padding:20px;font-family:monospace;white-space:pre-wrap">
React render error:\n${err instanceof Error ? err.stack : String(err)}
    </div>`
  }
}
