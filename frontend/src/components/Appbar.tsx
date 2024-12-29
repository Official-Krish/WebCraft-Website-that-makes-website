import { Button } from "./ui/button"

export function Appbar() {
  return (
    <header className="top-0 w-full border-b px-7 bg-black border-gray-800">
      <div className="flex h-14 items-center justify-between">
        <a href="/" className="font-bold text-white">
          Website Generator
        </a>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="text-white">
            <a href="/sign-in">Sign In</a>
          </Button>
          <Button asChild className="text-white hover:bg-neutral-800">
            <a href="/sign-up">Sign Up</a>
          </Button>
        </div>
      </div>
    </header>
  )
}

