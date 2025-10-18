import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LatexLinter } from './components/LatexLinter'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LatexLinter />
  </StrictMode>,
)

