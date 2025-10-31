/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './ui/pages/*.{html,js,ts,jsx,tsx,mdx}',
    './ui/pages/**/*.{html,js,ts,jsx,tsx,mdx}', 
    './ui/studio-components/**/*.{html,js,ts,jsx,tsx,mdx}',
    './ui/UIs/**/*.{html,js,ts,jsx,tsx,mdx}', 
    './ui/components/*.{html,js,ts,jsx,tsx,mdx}', 
    './ui/components/**/*.{html,js,ts,jsx,tsx,mdx}',
    './ui/app/**/*.{js,ts,jsx,tsx,mdx}',
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
