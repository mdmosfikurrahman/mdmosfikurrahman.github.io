import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'2xl': '1180px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				serif: ['Fraunces', 'Times New Roman', 'serif'],
				mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
				display: ['Fraunces', 'Times New Roman', 'serif'],
			},
			colors: {
				paper: 'hsl(var(--paper))',
				'paper-deep': 'hsl(var(--paper-deep))',
				ink: 'hsl(var(--ink))',
				'ink-soft': 'hsl(var(--ink-soft))',
				whisper: 'hsl(var(--whisper))',
				rule: 'hsl(var(--rule))',
				'rule-soft': 'hsl(var(--rule-soft))',

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
					deep: 'hsl(var(--accent-deep))',
					wash: 'hsl(var(--accent-wash))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			fontSize: {
				'2xs': ['0.6875rem', { lineHeight: '1rem' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			maxWidth: {
				prose: '68ch',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
