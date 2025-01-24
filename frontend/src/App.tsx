import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { Builder } from "./pages/Builder"
import { Prompt2 } from "./components/Prompt2"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/create" element={<Prompt2 />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
