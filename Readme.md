# AI Website Generator

A modern web application that uses AI to generate beautiful, production-ready websites. Built with TypeScript, React, Node.js, and powered by Claude AI.

## 🚀 Features

- AI-powered website generation
- Modern, responsive layouts
- Pre-built templates for common use cases
- Real-time preview
- One-click deployment
- Custom component library
- Dark mode by default

## 🛠️ Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - React Router DOM
  - Lucide Icons

- **Backend:**
  - Node.js
  - Express
  - Claude AI Integration

- **Development Tools:**
  - Vite
  - ESLint
  - Prettier
  - PostCSS

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Official-Krish/Bolt
cd Bolt
```

2. Install dependencies:
```bash
cd backend
pnpm install
```

```bash
cd frontend
pnpm install
```

3. Create a `config.ts` file in the frontend root directory:
```env
BACKEND_URL=your_backend_url
```

4. Start the development server:
```bash
cd backend
pnpm run dev
```

```bash
cd frontend
pnpm dev
```

## 🏗️ Project Structure

```
ai-website-generator/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   └── ...
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   └── App.tsx
├── public/
├── server/
│   ├── routes/
│   └── index.ts
└── package.json
```

## 🔧 Configuration

### Tailwind Configuration

The project uses Tailwind CSS with a custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    }
  },
  plugins: []
}
```

### Environment Variables

Required environment variables:

- `BACKEND_URL`: Backend API URL
- `CLAUDE_API_KEY`: API key for Claude AI integration

## 🚀 Deployment

1. Build the project:
```bash
pnpm run build
```

2. Preview the build:
```bash
pnpm run preview
```

3. Deploy to your preferred platform (Vercel, Netlify, etc.)


## 📝 Scripts

- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run preview`: Preview production build
- `pnpm run lint`: Lint code
- `pnpm run format`: Format code with Prettier
- `pnpm run typecheck`: Check TypeScript types

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Claude AI](https://anthropic.com) for AI integration
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [React](https://reactjs.org) for the frontend framework
- [TypeScript](https://www.typescriptlang.org) for type safety

## 📞 Support

For support, please email Krishanand974@gmail.com.