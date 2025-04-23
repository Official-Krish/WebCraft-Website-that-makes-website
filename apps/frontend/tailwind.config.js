/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
			brown: '#1a1a18',
			brown2: '#262626',
			brown3: '#171717',
			brown4: '#404040',
			black2: '#171717',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
			  border: 'hsl(var(--border))',
			  input: 'hsl(var(--input))',
			  ring: 'hsl(var(--ring))',
			  background: 'hsl(var(--background))',
			  foreground: 'hsl(var(--foreground))',
			  primary: {
				  DEFAULT: 'hsl(var(--primary))',
				  foreground: 'hsl(var(--primary-foreground))'
			  },
			  secondary: {
				  DEFAULT: 'hsl(var(--secondary))',
				  foreground: 'hsl(var(--secondary-foreground))'
			  },
			  destructive: {
				  DEFAULT: 'hsl(var(--destructive))',
				  foreground: 'hsl(var(--destructive-foreground))'
			  },
			  muted: {
				  DEFAULT: 'hsl(var(--muted))',
				  foreground: 'hsl(var(--muted-foreground))'
			  },
			  accent: {
				  DEFAULT: 'hsl(var(--accent))',
				  foreground: 'hsl(var(--accent-foreground))'
			  },
			  popover: {
				  DEFAULT: 'hsl(var(--popover))',
				  foreground: 'hsl(var(--popover-foreground))'
			  },
			  card: {
				  DEFAULT: 'hsl(var(--card))',
				  foreground: 'hsl(var(--card-foreground))'
			  },
			  dark: {
				  100: '#121212',
				  200: '#0A0A0A',
				  300: '#000000',
			  },
			  sidebar: {
				  DEFAULT: 'hsl(var(--sidebar-background))',
				  foreground: 'hsl(var(--sidebar-foreground))',
				  primary: 'hsl(var(--sidebar-primary))',
				  'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				  accent: 'hsl(var(--sidebar-accent))',
				  'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				  border: 'hsl(var(--sidebar-border))',
				  ring: 'hsl(var(--sidebar-ring))'
			  }
		  },
		  borderRadius: {
			  lg: 'var(--radius)',
			  md: 'calc(var(--radius) - 2px)',
			  sm: 'calc(var(--radius) - 4px)'
		  },
		  keyframes: {
			  'accordion-down': {
				  from: { height: '0' },
				  to: { height: 'var(--radix-accordion-content-height)' }
			  },
			  'accordion-up': {
				  from: { height: 'var(--radix-accordion-content-height)' },
				  to: { height: '0' }
			  },
			  'fade-in': {
				  '0%': { opacity: '0', transform: 'translateY(10px)' },
				  '100%': { opacity: '1', transform: 'translateY(0)' }
			  },
			  'fade-out': {
				  '0%': { opacity: '1', transform: 'translateY(0)' },
				  '100%': { opacity: '0', transform: 'translateY(10px)' }
			  },
			  'slide-up': {
				  '0%': { opacity: '0', transform: 'translateY(20px)' },
				  '100%': { opacity: '1', transform: 'translateY(0)' }
			  },
			  'scale-in': {
				  '0%': { opacity: '0', transform: 'scale(0.95)' },
				  '100%': { opacity: '1', transform: 'scale(1)' }
			  },
			  'glow': {
				  '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
				  '50%': { opacity: '0.7', boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }
			  },
			  'pulse-border': {
				  '0%, 100%': { borderColor: 'rgba(59, 130, 246, 0.7)' },
				  '50%': { borderColor: 'rgba(59, 130, 246, 0.3)' }
			  },
			  'gradient-shift': {
				  '0%': { backgroundPosition: '0% 50%' },
				  '50%': { backgroundPosition: '100% 50%' },
				  '100%': { backgroundPosition: '0% 50%' }
			  }
		  },
		  animation: {
			  'accordion-down': 'accordion-down 0.2s ease-out',
			  'accordion-up': 'accordion-up 0.2s ease-out',
			  'fade-in': 'fade-in 0.5s ease-out forwards',
			  'slide-up': 'slide-up 0.5s ease-out forwards',
			  'scale-in': 'scale-in 0.3s ease-out forwards',
			  'glow': 'glow 3s ease-in-out infinite',
			  'pulse-border': 'pulse-border 2s ease-in-out infinite',
			  'gradient-shift': 'gradient-shift 3s ease infinite'
		  },
		  backgroundImage: {
			  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			  'hero-glow': 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15), transparent 70%)',
			  'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
		  	}
  		}
  	},
  plugins: [require("tailwindcss-animate")],
}