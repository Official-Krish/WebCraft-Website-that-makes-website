import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Footer } from './components/Footer.tsx'
import { Appbar2 } from './components/Appbar2.tsx'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')!).render(
  <>
    <RecoilRoot>
      <Appbar2 />
      <App/>
      <Footer />
    </RecoilRoot>
  </>
)
