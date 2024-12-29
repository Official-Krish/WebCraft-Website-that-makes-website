import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mic, Plus, ArrowUp } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function PromptInput() {
  const [prompt, setPrompt] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask v0 a question..."
        className="pr-32 border-gray-900 h-12 text-white"
      />
      <div className="absolute right-1.5 top-1.5 flex items-center gap-2">
        <div>
          <Mic className="h-4 w-4 text-white cursor-pointer" />
        </div>
        <Button size="icon" variant="link" type="button">
          <Plus className="h-4 w-4 text-white cursor-pointer" />
        </Button>
        <Button size="icon" type="submit" variant="link" className="bg-white" onClick={() => handleSubmit}>
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}