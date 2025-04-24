import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RecoilRoot } from 'recoil'
import Appbar from './components/Appbar.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <RecoilRoot>
      <Appbar />
      <App/>
    </RecoilRoot>
  </>
)
