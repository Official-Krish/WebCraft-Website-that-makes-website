import { ExamplePrompts } from "../components/ExapmlePrompts"
import { PromptInput } from "../components/PromptInput";
export default function Prompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-4 bg-black">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">What can I help you with?</h1>
        <PromptInput />
        <ExamplePrompts />
        <section className="pt-12">
          <h2 className="text-2xl font-semibold mb-6 text-white">Starter Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="/templates/nextjs" 
              className="group relative rounded-lg border border-gray-900 p-6 hover:border-white"
            >
              <h3 className="font-semibold text-white">Reactjs + shadcn/ui</h3>
              <p className="text-sm text-muted-foreground">Reactjs + Tailwind CSS + shadcn/ui.</p>
            </a>
            <a 
              href="/templates/forms" 
              className="group relative rounded-lg border border-gray-900 p-6 hover:border-white"
            >
              <h3 className="font-semibold text-white">Reactjs + Nodejs</h3>
              <p className="text-sm text-muted-foreground">Server actions and Zod validation.</p>
            </a>
            <a 
              href="/templates/charts" 
              className="group relative rounded-lg border border-gray-900 p-6 hover:border-white"
            >
              <h3 className="font-semibold text-white">Reactjs + Charts</h3>
              <p className="text-sm text-muted-foreground">Build charts using shadcn/ui charts.</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
