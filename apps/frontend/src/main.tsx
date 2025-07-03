import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RecoilRoot } from 'recoil'
import Appbar from './components/Appbar.tsx'
import Footer from './components/Footer.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <RecoilRoot>
      {(window.location.pathname === '/prompt' || window.location.pathname === '/signin' || window.location.pathname === '/signup' || window.location.pathname === '/home' ) && (
        <Appbar />
      )}
      <App/>
      {(window.location.pathname === '/prompt' || window.location.pathname === '/signin' || window.location.pathname === '/signup' ) && (
        <Footer/>
      )}
    </RecoilRoot>
  </>
)
