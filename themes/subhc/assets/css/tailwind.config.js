module.exports = {
  theme: {
    extend: {
      colors: {
        'ridiculousblue': '#153e67',
        'ridiculouslblue': '#0d5398',
        'ridiculousorange': '#e55d47',
        'ridiculousgray': '#b1b1b1',
        'ridiculousyellow': '#fefef1',
        'ridiculouspurple': '#5500ff',
      },
      fontSize: {
        'x6': '.6rem',
        'x7': '.7rem',
        'x8': '.8rem',
        'x9': '.9rem',
        'x925': '.925rem',
        'x95': '.95rem',
        'x975': '.975rem',
        'x1050': '1.05rem',
        'x1100': '1.1rem',
        'x1200': '1.2rem',
      },

      minWidth: {
        '96': '24rem',
      },
      width: {
        '120': '30rem',
      },
      zIndex: {
        '-10': '-10',
      },
      fontFamily: {
        'baloo': ['"Baloo Da 2"','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
        'neuton': ['Neuton','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
        'montserrat': ['"Nunito"','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
        'google': ['"Google Sans"','"Helvetica Neue"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
        'robotoslab': ['"Roboto Slab"','"Helvetica Neue"','Helvetica','Arial','sans-serif'],
      },
    },
  },
  variants: {
    textColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'active'],
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
}
// http://www.robinfwilliams.com/resume