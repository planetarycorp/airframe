const {resolve} = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackMD5Hash = require('webpack-md5-hash');
const webpackValidator = require('webpack-validator');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');

module.exports = (env) => {
    const {ifProd, ifNotProd} = getIfUtils(env);
    const config = webpackValidator({
        context: resolve('assets'),
        entry: [
            './scripts/index.js'
        ],
        output: {
            filename: ifProd('scripts/bundle-[chunkhash:8].js', 'scripts/bundle.js'),
            path: resolve('build'),
            pathinfo: ifNotProd(),
            publicPath: '/'
        },
        devtool: ifProd('source-map', 'eval'),
        devServer: {
            stats: 'errors-only',
            historyApiFallback: ifNotProd()
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/,
                    query: {
                        cacheDirectory: ifNotProd()
                    }
                },
                {
                    test: /\.css$/,
                    loader: ifProd(ExtractTextPlugin.extract({
                        fallbackLoader: 'style',
                        loader: 'css!postcss'
                    }), 'style!css!postcss')
                },
                {
                    test: /\.pug$/,
                    loader: 'pug'
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loaders: [
                        'file?name=images/[name].[ext]',
                        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                    ]
                },
                {
                    test: /\.woff$/,
                    loader: 'url',
                    query: {
                        name: 'fonts/[name].[ext]',
                        limit: 5000,
                        mimetype: 'application/font-woff'
                    }
                },
                {
                    test: /\.ttf$|\.eot$/,
                    loader: 'file',
                    query: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            ]
        },
        postcss(wp) {
            return [
                require('postcss-import')({
                    addDependencyTo: wp
                }),
                require('postcss-mixins'),
                require('postcss-cssnext')
            ];
        },
        plugins: removeEmpty([
            new ProgressBarPlugin(),
            ifProd(new ExtractTextPlugin('styles/styles-[chunkhash:8].css')),
            new StyleLintPlugin({
                configFile: '.stylelintrc',
                files: 'styles/**/*.css'
            }),
            ifProd(new InlineManifestPlugin()),
            ifProd(new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            })),
            ifProd(new webpack.optimize.DedupePlugin()),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new WebpackMD5Hash(),
            new HtmlWebpackPlugin({
                template: './templates/views/index.pug'
            }),
            new HtmlWebpackPlugin({
                template: './templates/views/styles.pug',
                filename: 'styles.html'
            }),
            new CopyPlugin([
                // Copy fonts to build directory
                {from: 'fonts', to: 'fonts'}
            ], {
                ignore: [
                    '.*'
                ]
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: ifProd('"production"', '"development"')
                }
            }),
            new webpack.NamedModulesPlugin()
        ])
    });
    return config;
};
