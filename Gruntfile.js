module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile');
	var dist = 'betajs-zangodb';

	gruntHelper.init(pkg, grunt)


	/* Compilation */
		.scopedclosurerevisionTask(null, "src/**/*.js", "dist/" + dist + "-noscoped.js", {
			"module": "global:BetaJS.Data.Databases.Zango",
			"base": "global:BetaJS",
			"data": "global:BetaJS.Data"
		}, {
			"base:version": pkg.dependencies.betajs,
			"data:version": pkg.dependencies["betajs-data"]
		})
		.concatTask('concat-scoped', [require.resolve("betajs-scoped"), 'dist/' + dist + '-noscoped.js'], 'dist/' + dist + '.js')
		.uglifyTask('uglify-noscoped', 'dist/' + dist + '-noscoped.js', 'dist/' + dist + '-noscoped.min.js')
		.uglifyTask('uglify-scoped', 'dist/' + dist + '.js', 'dist/' + dist + '.min.js')
		.packageTask()
        .jsbeautifyTask(null, "src/*.js")
        .browserqunitTask(null, "tests/tests.html", true)
        .browserqunitTask("benchmarks", "benchmarks/compare.html", true)

		/* Testing */
		.closureTask(null, [require.resolve("betajs-scoped"), require.resolve("betajs"), require.resolve("betajs-data"), "./dist/betajs-sql-noscoped.js"])
		.lintTask(null, ['./src/**/*.js', './dist/' + dist + '-noscoped.js', './dist/' + dist + '.js', './Gruntfile.js', './tests/**/*.js'])
        .githookTask(null, "pre-commit", "check-node")

		/* External Configurations */
		.codeclimateTask()

		/* Markdown Files */
		.readmeTask()
		.licenseTask()

		/* Documentation */
		.docsTask();

	grunt.initConfig(gruntHelper.config);

	grunt.registerTask('default', ['package', 'githook', 'readme', 'license', 'codeclimate', 'jsbeautify', 'scopedclosurerevision', 'concat-scoped', 'uglify-noscoped', 'uglify-scoped']);
    grunt.registerTask('check-node', [ 'lint' ]);
    grunt.registerTask('check', ['check-node', 'browserqunit']);

};

