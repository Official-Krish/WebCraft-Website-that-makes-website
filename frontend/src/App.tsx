import { BrowserRouter, Route, Routes } from "react-router-dom"
import Prompt from "./pages/Prompt"
import Home from "./pages/Home"
import { Builder } from "./pages/Builder"
import { Prompt2 } from "./components/Prompt2"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Prompt />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/make" element={<Prompt2 />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
