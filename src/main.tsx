import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { recoverFromStaleChunks } from './lib/chunk-recovery'
import { trackInputModality } from './lib/input-modality'
import { trackMovingAnimations } from './lib/motion'
import './index.css'

recoverFromStaleChunks()
trackInputModality()
trackMovingAnimations()

createRoot(document.getElementById('root')!).render(<App />)
