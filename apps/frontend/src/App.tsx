import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { Builder } from "./pages/Builder"
import { Prompt2 } from "./components/Prompt2"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/" element={<Prompt2 />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
