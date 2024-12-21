module.exports = {
  name: 'didomi',
  script: 'tsc -p tsconfig.json && node ./dist/index.js',
  watch: ['src'],
  watch_delay: 1000,
  ignore_watch: ['node_modules'],
}
