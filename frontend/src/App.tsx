import { BrowserRouter, Route, Routes } from "react-router-dom"
import Prompt from "./pages/Prompt"
import Home from "./pages/Home"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Prompt />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
