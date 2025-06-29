import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'

// Define the configuration with TypeScript typing
const config: UserConfig = {
  server: {
    headers: {},
  }
}

export default defineConfig(config)