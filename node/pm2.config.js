module.exports = {
  name: 'code-challenge',
  script: 'tspc -p tsconfig.json && node ./dist/src/index.js',
  watch: ['src'],
  watch_delay: 1000,
  ignore_watch: ['node_modules'],
}
