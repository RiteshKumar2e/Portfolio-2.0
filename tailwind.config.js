/** @type {import('tailwindcss').Config} */

// "Field Manuals" editorial palette — earth-toned ink, paper and bronze.
// The cool families the components were written against (indigo, blue, slate…)
// are remapped here so every component picks up the theme without per-file edits.

// Warm bronze — the single brand accent (#c3a47b).
const bronze = {
    50: '#faf5ec',
    100: '#f3e9d7',
    200: '#e8d6b6',
    300: '#dbc39c',
    400: '#c3a47b',
    500: '#b7976c',
    600: '#8f6f45',
    700: '#735836',
    800: '#58432a',
    900: '#3f3020',
    950: '#271d13',
    DEFAULT: '#c3a47b',
};

// Muted sage — secondary tone, used where the old design used blue/sky/cyan.
const sage = {
    50: '#f4f5ef',
    100: '#e6e9dc',
    200: '#cfd4bb',
    300: '#b2ba96',
    400: '#959e77',
    500: '#7b845e',
    600: '#636b4a',
    700: '#4e553b',
    800: '#3c4130',
    900: '#2d3125',
    950: '#1c1f17',
    DEFAULT: '#7b845e',
};

// Terracotta clay — replaces rose/pink/red (still reads as "alert").
const clay = {
    50: '#fbf1ec',
    100: '#f5e0d6',
    200: '#eac2b0',
    300: '#dc9f86',
    400: '#cc7f62',
    500: '#b8654a',
    600: '#9c5039',
    700: '#7d402f',
    800: '#5f3226',
    900: '#45261e',
    950: '#2a1712',
};

// Ochre — replaces orange/amber/yellow.
const ochre = {
    50: '#fbf6e9',
    100: '#f5e9c9',
    200: '#ebd59a',
    300: '#dfbd6b',
    400: '#d2a64a',
    500: '#bf8e35',
    600: '#a0722a',
    700: '#7f5923',
    800: '#60441d',
    900: '#463218',
    950: '#2b1f0f',
};

// Warm ink / paper neutrals — replaces slate & gray.
const ink = {
    50: '#faf6ee',
    100: '#f3ebdc',
    200: '#e8dcc4',
    300: '#c5b79e',
    400: '#a0937a',
    500: '#7a705b',
    600: '#5e5646',
    700: '#474134',
    800: '#3a382b',
    900: '#29251d',
    950: '#1d1a15',
};

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                white: '#fffcf6',
                ink,
                bronze,
                sage,
                primary: bronze,
                secondary: sage,
                accent: bronze,
                // Remapped families (see note at top).
                indigo: bronze,
                violet: bronze,
                purple: bronze,
                blue: sage,
                sky: sage,
                cyan: sage,
                teal: sage,
                emerald: sage,
                green: sage,
                lime: sage,
                rose: clay,
                pink: clay,
                red: clay,
                fuchsia: clay,
                orange: ochre,
                amber: ochre,
                yellow: ochre,
                slate: ink,
                gray: ink,
                zinc: ink,
                neutral: ink,
            },
            fontFamily: {
                sans: ['"Iowan Old Style"', 'Newsreader', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
                serif: ['"Iowan Old Style"', 'Newsreader', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
                display: ['"Iowan Old Style"', 'Newsreader', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            // Serif faces read heavy at 800–900; cap the scale at an editorial 600.
            fontWeight: {
                extrabold: '600',
                black: '600',
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
                'soft': '0 1px 2px rgba(41, 37, 29, 0.05), 0 12px 28px -16px rgba(41, 37, 29, 0.22)',
                'premium': '0 12px 32px -16px rgba(41, 37, 29, 0.28)',
                'premium-hover': '0 24px 48px -20px rgba(143, 111, 69, 0.35)',
                'neon': '0 6px 24px -8px rgba(195, 164, 123, 0.35)',
            },
        },
    },
    plugins: [],
}
