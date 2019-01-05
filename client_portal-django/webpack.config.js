const autoprefixer = require('autoprefixer');

module.exports = [{
    entry: {
        style: './assets/style/main.scss',
        index: './assets/js/index.js',
        pdfjsWorker: './node_modules/pdfjs-dist/build/pdf.worker.js',
    },
    output: {
      filename: './static/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './static/bundle.css',
                        },
                    },
                    {loader: 'extract-loader'},
                    {loader: 'css-loader'},
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['./node_modules']
                        }
                    },
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-assign'],
                    cacheDirectory: true,
                },
            }
        ]
    },
}];