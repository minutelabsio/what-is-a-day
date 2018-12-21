module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/what-is-a-day/'
    : '/'
  , configureWebpack: {
    resolve: { symlinks: false }
  }
  , css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        data: `@import '@/styles/_variables.scss';`
      }
    }
  }
}
