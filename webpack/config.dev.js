const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const assetsPath = path.resolve(__dirname, '..', 'assets');
const assetsDir = {
    fonts: path.resolve(assetsPath, 'fonts'),
    images: path.resolve(assetsPath, 'images'),
    scripts: path.resolve(assetsPath, 'scripts'),
    styles: path.resolve(assetsPath, 'styles'),
    templates: path.resolve(assetsPath, 'templates')
};

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:8080/',
        'webpack/hot/only-dev-server',
        path.resolve(assetsDir.scripts, 'index.js')
    ],
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: 'scripts/bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: assetsDir.scripts,
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.scss$/,
                loader: 'style!css!postcss!sass',
                include: assetsDir.styles
            },
            {
                test: /\.pug$/,
                loader: 'pug',
                include: assetsDir.templates,
                root: assetsPath
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?name=images/[name].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ],
                include: assetsDir.images
            },
            {
                test: /\.woff$/,
                loader: 'url',
                include: assetsDir.fonts,
                query: {
                    name: 'fonts/[name].[ext]',
                    limit: 5000,
                    mimetype: 'application/font-woff'
                }
            },
            {
                test: /\.ttf$|\.eot$/,
                loader: 'file',
                include: assetsDir.fonts,
                query: {
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    postcss: [
        require('postcss-cssnext')
    ],
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(assetsDir.templates, 'views', 'index.pug')
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(assetsDir.templates, 'views', 'styles.pug'),
            filename: 'styles.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
