module.exports = {
  theme: {
    extend: {},
    colors: {
      'ridiculousblue': '#29558c',
      'ridiculousorange': '#e55d47',
      'ridiculousgreen': '#202e78',
    },
    fontSize: {
      'xxxxs': '.6rem',
      'xxxs': '.65rem',
      'xxx2s': '.775rem',
      'xxs': '.85rem',
      'xx2s': '.9rem',
      'xheader': '1rem',
      'xheader2': '1.25rem'
    },
    fontFamily: {
      'myserif': ['"Source Serif Pro"', 'Georgia', '"Times New Roman"', 'Times', 'serif'],
      'baloo': ['"Baloo Da 2"','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
      'neuton': ['Neuton','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
      'montserrat': ['Montserrat','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
