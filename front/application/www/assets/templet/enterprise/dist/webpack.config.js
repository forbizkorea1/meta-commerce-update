const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isProductionMode = process.env.NODE_ENV.includes('production');
const isProductionPackageMode = process.env.NODE_ENV.includes('productionPackage');

const config = {
    devtool: isProductionMode ? false : "source-map",
    devServer: {
        //host: 'localhost',
        //inline: true,
        //hot:true,
        port: 1103,
        contentBase: path.resolve(__dirname, '../')
    },
    entry : {
        'vendor' : ['babel-polyfill','jquery','jstree','slick-carousel','jquery-form','handlebars/dist/handlebars.js','jquery-datepicker'],
        'main' : ['./js/app','./scss/main.scss'],
        'common' : './scss/common.scss',
        'shop' : './scss/shop.scss',
        'member' : './scss/member.scss',
        'mypage' : './scss/mypage.scss',
        'customer' : './scss/customer.scss',
        'event' : './scss/event.scss',
    },
    output : {
        path: path.resolve(__dirname, '../'),
        filename:'assets/js/[name].js',

        devtoolModuleFilenameTemplate: info => {
            let filePath = info.absoluteResourcePath;
            filePath = filePath.replace(/\\/g, '/');
      
            return `file:///${filePath}`
          },
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                exclude: /node_modules/,
                use : {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory:true
                    }
                }
            }
            ,{
                test: /\.(css|scss|sass)$/,

                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 2
                        },
                    },{
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !isProductionMode,
                        }
                    },{
                        loader: 'sass-loader',
                        options: {
                            outputStyle: isProductionMode && !isProductionPackageMode ? 'compact' : 'expanded',
                            sourceMap: !isProductionMode,
                        },
                    }
                ]
            },{
                test: /\.(png|jpg|gif|jpeg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                //include: path.resolve(__dirname, '../'),
                options: {
                    name: '[path][name].[ext]',
                    publicPath: '../../',
                    outputPath: '/',
                },
			}
			/*,{
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                //include: path.resolve(__dirname, '../'),
                options: {
                    publicPath: './',
                    limit: 10000,
                },
            }*/
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: "assets/css/[name].css",
            chunkFilename: "assets/css/main_id.css"
        })
    ]
};

module.exports = config;