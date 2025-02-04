export function ExamplePrompts() {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        <ExamplePrompt text="Generate a sticky header" />
        <ExamplePrompt text="How can I structure LLM output?" />
        <ExamplePrompt text="Write code to implement a min heap" />
      </div>
    )
}
  
function ExamplePrompt({ text }: { text: string }) {
    return (
      <button className="inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-sm hover:bg-neutral-800 text-white">
        {text} →
      </button>
    )
}