import { BrowserRouter, Route, Routes } from "react-router-dom"
import Prompt from "./pages/Prompt"
import Home from "./pages/Home"
import { Builder } from "./pages/Builder"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Prompt />} />
          <Route path="/builder" element={<Builder />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
