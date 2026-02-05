/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          activityBar: '#333333',
          header: '#2d2d2d',
          accent: '#007acc',
          text: '#cccccc',
          border: '#454545'
        }
      }
    },
  },
  plugins: [],
}
