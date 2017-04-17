// Karma configuration
// Generated on Mon Apr 17 2017 12:43:13 GMT+0800 (HKT)

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],


		// list of files / patterns to load in the browser
		files: [        
			'client/bower_components/jasmine/lib/jasmine-core/jasmine.js',
			'client/bower_components/jasmine/lib/jasmine-core/jasmine-html.js',
			'client/bower_components/jasmine/lib/jasmine-core/boot.js',
			'client/bower_components/jquery/dist/jquery.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.js',
			'client/bower_components/angular/angular.min.js',
			'client/bower_components/angular-mocks/angular-mocks.js',
			'client/config.js',
			'client/graphController.js',
			'client/chatController.js',
			'client/bindings.js',
			'client/test/**/*.spec.js'
		],


		// list of files to exclude
		exclude: [
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	})
}
