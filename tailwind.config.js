/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ji-g-0o-i': '#F6F6F6',
        'x': '#454545',
        'x-2': '#ABABAB',
        'x-9g-itj-q': '#091D9E',
        'n-44-wi-q': '#BCC5FF',
        'm-1hr15': '#EBBA1A',
        'y-iy-2x-5': '#DEDDDD',
      },
      fontFamily: {
        logo: ['"Disket Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
