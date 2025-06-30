import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { Project } from "./pages/Project"
import { Prompt } from "./pages/Prompt"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Prompt />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/project/:projectId" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
