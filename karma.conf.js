// karma.conf.js
const webpack = require('webpack');

var webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: ['test/**/*.spec.js'],
        preprocessors: {
            '**/*.spec.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        reporters: ['spec'],
        browsers: ['Chrome'],
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development')
                }
            }),
            // Launchers
            'karma-chrome-launcher',

            // Test Libraries
            'karma-mocha',
            'karma-chai',

            // Preprocessors
            'karma-webpack',
            'karma-sourcemap-loader',

            // Reporters
            'karma-spec-reporter',
            'karma-coverage'
        ]
    })
};
