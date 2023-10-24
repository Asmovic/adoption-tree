module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/stylesheets/variables.scss";`
      }
    }
  },
  publicPath: "/",
  outputDir: "./../backend/public",
  assetsDir: "assets",
  indexPath: "./../views/index.html"
};
