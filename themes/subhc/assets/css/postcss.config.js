const themeDir = __dirname + '/../../';

const purgecss = require('@fullhuman/postcss-purgecss')({
    // see https://gohugo.io/hugo-pipes/postprocess/#css-purging-with-postcss
    content: [
        './hugo_stats.json',
        themeDir + '/hugo_stats.json',
        'exampleSite/hugo_stats.json',
    ],
    defaultExtractor: (content) => {
        let els = JSON.parse(content).htmlElements;
        return els.tags.concat(els.classes, els.ids);
    }
})

module.exports = {    
    plugins: [        
        require('postcss-import')({ path: [themeDir] }),
        require('tailwindcss')(themeDir + 'assets/css/tailwind.config.js'),
        require('autoprefixer')({ path: [themeDir] }),
        require('postcss-font-magician')({
            variants: {
                'Baloo Da 2': {
                    '400': [],
                    '500': ['woff2', 'U+0020-007F']
                },
                'Neuton': {
                    '700': ['woff2', 'U+0020-007F']
                },
                'Montserrat': {
                    '300': [],
                    '400': []
                }
            }
        }),
        ...(process.env.HUGO_ENVIRONMENT === 'production' ? [purgecss] : [])
    ]
}
