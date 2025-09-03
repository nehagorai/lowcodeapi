/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/*.{html,js,ts,jsx,tsx,mdx}',
    './pages/**/*.{html,js,ts,jsx,tsx,mdx}', 
    './studio-components/**/*.{html,js,ts,jsx,tsx,mdx}',
    './UIs/**/*.{html,js,ts,jsx,tsx,mdx}', 
    './components/*.{html,js,ts,jsx,tsx,mdx}', 
    './components/**/*.{html,js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
