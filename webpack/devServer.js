const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./config.dev');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
    }
}).listen(8080, 'localhost', (err) => {
    if (err) console.log(err);

    console.log('Listening at http://localhost:8080');
});
