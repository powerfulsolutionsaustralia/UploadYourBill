/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#fbbf24",
                secondary: "#10b981",
                accent: "#6366f1",
                "dark-bg": "#020617",
                "dark-surface": "#0f172a",
                "text-dim": "#94a3b8",
            },
        },
    },
    plugins: [],
}
