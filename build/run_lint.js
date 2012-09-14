var config = {
    filepaths: [
		'source/'
	],
	exclusions: [
		// ...
	],
	jsLint: './build/jslint.js',
	lintOptions: {},
	verbose: false,
	stopOnFirstError: false,
	logFile: './output/error.log'
};

phantom.injectJs('PhantomLint.js');
PhantomLint.init(config);
