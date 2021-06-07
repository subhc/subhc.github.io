module.exports = {
  theme: {
    extend: {
      colors: {
        'ridiculousblue': '#29558c',
        'ridiculousorange': '#e55d47',
        'ridiculousgray': '#b1b1b1',
        'ridiculousyellow': '#fefef1',
      },
      fontSize: {
        'xxxxs': '.6rem',
        'xxxs': '.65rem',
        'xxx1s': '.7rem',
        'xxx2s': '.775rem',
        'xxs': '.85rem',
        'xx2s': '.9rem',
        'xheader': '1rem',
        'xheader2': '1.25rem'
      },

      zIndex: {
        '-10': '-10',
      },
      fontFamily: {
        'baloo': ['"Baloo Da 2"','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
        'neuton': ['Neuton','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
        'montserrat': ['Montserrat','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
}
