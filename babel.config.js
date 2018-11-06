const IS_TEST = process.env.NODE_ENV === 'test'
const IS_ESM = !IS_TEST && process.env.MODULES !== 'cjs'

module.exports = {
  'presets': [
    [
      '@babel/preset-env', {
        modules: IS_ESM ? false : 'commonjs',
        targets: IS_TEST ? { node: true } : {},
        loose: true
      }
    ]
  ],
  'plugins': [
    '@babel/plugin-transform-flow-strip-types',
    [ '@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true, loose: true } ]
  ]
}
