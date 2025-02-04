import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Footer } from './components/Footer.tsx'
import { Appbar2 } from './components/Appbar2.tsx'
import { AppBar } from './components/Appbar.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    {window.location.pathname == '/home' && <AppBar/> }
    {window.location.pathname != '/home' &&  <Appbar2/>}
    {window.location.pathname == '/builder' && ""}
    <App/>
    <Footer />
  </>
)
