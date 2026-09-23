/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        risk: {
          low: '#22c55e',
          moderate: '#eab308',
          high: '#f97316',
          critical: '#ef4444',
        },
        gov: {
          900: '#071428',
          800: '#0b1e3e',
          700: '#1a365d',
          600: '#2a4a7f',
          500: '#3b6cb5',
          400: '#5a8ad4',
          saffron: '#FF9933',
          green: '#138808',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
