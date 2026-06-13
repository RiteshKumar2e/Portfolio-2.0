/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Single disciplined accent — indigo — used for all interactive/brand moments.
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                    DEFAULT: '#4f46e5',
                },
                // Muted support tone for subtle depth (used sparingly).
                secondary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                    DEFAULT: '#7c3aed',
                },
                accent: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                    DEFAULT: '#3b82f6',
                },
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'float': 'float 8s ease-in-out infinite',
                'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                'fade-in': 'fadeIn 0.8s ease-out',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-16px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(40px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                // Soft, professional elevation — no neon.
                'soft': '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 28px -16px rgba(15, 23, 42, 0.18)',
                'premium': '0 12px 32px -16px rgba(15, 23, 42, 0.22)',
                'premium-hover': '0 24px 48px -20px rgba(79, 70, 229, 0.28)',
                'neon': '0 6px 24px -8px rgba(79, 70, 229, 0.30)',
            },
        },
    },
    plugins: [],
}
