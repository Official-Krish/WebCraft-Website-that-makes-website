import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { Prompt2 } from "./pages/Prompt2"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { Project } from "./pages/Project"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Prompt2 />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/project/:projectId" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
