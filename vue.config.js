const webpack = require("webpack");

module.exports = {
  chainWebpack: config => {
    config.module.rules.delete("eslint");
  },
  configureWebpack: (env) => {
    const fiscalYear = process.env.VUE_APP_FISCAL_YEAR;
    let tag = `FY${fiscalYear.toString().slice(2)}`

    return {
      externals: {
        jquery: "jQuery",
        $: "jQuery"
      },
      entry: {
        main: './src/main.js',
      },
      output: {
        filename: `departmental-dashboard-${tag}.[name].[hash:7].js`,
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
          __REPORT_TAG__: JSON.stringify(tag),
        }),
      ],
      optimization: { splitChunks: false }
    }
  },
  css: {
    extract: false
  }
};
