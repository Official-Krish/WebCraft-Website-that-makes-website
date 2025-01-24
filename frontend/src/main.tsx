import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppBar } from './components/Appbar.tsx'
import { Footer } from './components/Footer.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <AppBar />
    <App/>
    <Footer />
  </>
)
