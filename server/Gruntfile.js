/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        yuidoc: {
            compile: {
                "name": "tVideo",
                "description": "tVideo - The smart TV beaming app",
                "version": "1.0.0",
                "url": "http://tvideo.com/",
                "options": {
                    "paths": '.',
                    "outdir": "./docs/server"
                }
            }
        },
        watch: {
            gruntfile: {
                files: ['services/*.js', 'models/*.js'],
                tasks: ['yuidoc']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['yuidoc']);

};
