module.exports = function(config) {
  config.set({

    // Base path, that will be used to resolve files and exclude
    basePath: '',

    // Frameworks to use
    frameworks: ['jasmine'],

    // List of files / patterns to load in the browser
    files: [
    	'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/angular-sanitize/angular-sanitize.js',
        
    	'dist/palette.js',
    	'test/helpers.js',
        'test/*.spec.js'  
    ],

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // A list of browsers to launch and capture
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};