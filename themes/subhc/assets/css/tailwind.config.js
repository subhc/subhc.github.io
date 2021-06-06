module.exports = {
  theme: {
    extend: {},
    colors: {
      'ridiculousblue': '#29558c',
      'ridiculousorange': '#e55d47',
      'ridiculousgreen': '#202e78',
    },
    fontFamily: {
      'myserif': ['"Source Serif Pro"', 'Georgia', '"Times New Roman"', 'Times', 'serif'],
      'baloo': ['"Baloo Da 2"','mono','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
