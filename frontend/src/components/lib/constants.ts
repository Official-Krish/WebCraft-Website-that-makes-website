import { ChevronUp, Copy, Image, Proportions, ShieldCheck, Zap } from "lucide-react";
import  Template1 from "../../assets/Template1.png";
import  Template2 from "../../assets/Template2.png";
import  Template3 from "../../assets/Template3.png";
import  Netflix from "../../assets/Netflix.png";
import  Slack from "../../assets/Slack.png";

export const steps = [
    { id: 1, title: "Type Your Prompt", description: "Describe your website in natural language", bgColor: "bg-blue-600" },
    { id: 2, title: "AI Generation", description: "Our AI creates your custom website design", bgColor: "bg-purple-600" },
    { id: 3, title: "Instant Preview", description: "See your website come to life instantly", bgColor: "bg-green-600" },
];

export const features = [
    {
      title: "AI-Powered Generation",
      description: "Transform your ideas into stunning websites with our advanced AI technology",
      icon: Zap,
    },
    {
      title: "Responsive Design",
      description: "Automatically optimized for all devices and screen sizes",
      icon: Proportions,
    },
    {
      title: "Custom Styles",
      description: "Personalize colors, fonts, and layouts to match your brand",
      icon: Image,
    },
    {
      title: "Instant Export",
      description: "Download your website code and assets with one click",
      icon: Copy,
    },
    {
      title: "SEO Optimized",
      description: "Built-in SEO best practices for better visibility",
      icon: ShieldCheck,
    },
    {
      title: "Fast Performance",
      description: "Optimized code for lightning-fast loading speeds",
      icon: ChevronUp,
    },
];


export const ChooseTemplates = [
    {
      step: "1",
      title: "Describe your vision",
      description:
        "Start by providing a basic prompt of the website you want to create. Our AI understands your ideas in any language.",
      image: Template1, 
    },
    {
      step: "2",
      title: "Refine and Regenerate",
      description:
        "Your website is ready. Select a section to request changes, and it will update instantly.",
      image: Template2, 
    },
    {
      step: "3",
      title: "Export your website",
      description:
        "Happy with your creation? Export your fully functional website and launch your online presence in minutes.",
      image: Template3, 
    },
];

export const Examples = [
    {
        image: Netflix,
        Prompt: "Generate Website for Netflix in modern style..."
    },
    {
        image: Slack,
        Prompt: "Generate Website for Slack in modern style..."
    }
]

export const gradientText = "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text";
export const glowEffect = "hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-shadow duration-300";


export const testing = `
<boltArtifact id="todo-app-ts" title="React Todo Application with TypeScript">
<boltAction type="file" filePath="package.json">
{
  "name": "todo-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
</boltAction>

<boltAction type="file" filePath="src/types/todo.ts">
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
</boltAction>

<boltAction type="file" filePath="src/components/TodoForm.tsx">
import { useState, FormEvent } from 'react'

interface TodoFormProps {
  addTodo: (text: string) => void;
}

export default function TodoForm({ addTodo }: TodoFormProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!value.trim()) return
    addTodo(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4" data-component="todo-form">
      <div className="flex gap-2" data-component="todo-form-input">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a new todo"
          className="flex-1 p-2 border rounded"
          data-component="todo-input"
        />
        <button 
          type="submit" 
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          data-component="todo-submit"
        >
          Add
        </button>
      </div>
    </form>
  )
}
</boltAction>

<boltAction type="file" filePath="src/components/TodoList.tsx">
import { Todo } from '../types/todo'

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export default function TodoList({ todos, toggleTodo, deleteTodo }: TodoListProps) {
  return (
    <ul className="space-y-2" data-component="todo-list">
      {todos.map((todo) => (
        <li 
          key={todo.id} 
          className="flex items-center gap-2 p-2 border rounded"
          data-component="todo-item"
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className="w-4 h-4"
            data-component="todo-checkbox"
          />
          <span
            className="line-through text-gray-500"
            data-component="todo-text"
          >
            {todo.text}
          </span>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
            data-component="todo-delete"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
</boltAction>

<boltAction type="file" filePath="src/App.tsx">
import { useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import { Todo } from './types/todo'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }])
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4" data-component="app">
      <h1 className="text-2xl font-bold mb-4 text-center" data-component="title">Todo App</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </div>
  )
}
</boltAction>

<boltAction type="file" filePath="src/main.tsx">
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
</boltAction>

<boltAction type="file" filePath="src/vite-env.d.ts">
/// <reference types="vite/client" />
</boltAction>

<boltAction type="file" filePath="tsconfig.json">
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
</boltAction>

<boltAction type="file" filePath="tsconfig.node.json">
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
</boltAction>

<boltAction type="file" filePath="vite.config.ts">
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
</boltAction>

<boltAction type="shell">
npm install && npm run dev
</boltAction>
</boltArtifact>
`