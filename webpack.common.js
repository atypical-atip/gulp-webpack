const path = require('path');


module.exports = {
    entry: {
        index: './app/js/index.js'
    },
    plugins: [],
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js'
    },
    //LOADERS
    module: {
        rules: [
            //Babel
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'app/js'),
                //Exclude folder
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                //Options
                options:
                {
                    presets: ["@babel/preset-env"]
                }
            },
        ],
    },
};