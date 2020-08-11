module.exports = {
  presets: [
    ['@babel/env', {
      'targets': {
        'chrome': '67'
      }
    }
    ]
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    'transform-vue-jsx'
  ],
  'comments': false
}
