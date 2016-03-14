module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['src/js/*.js', 'src/js/suisey-custom.js'],
        dest: 'build/suisey-custom.min.js'
      }
      },
    less: {
        development: {
            files: {
                "build/suisey-custom.css": "src/less/suisey-custom.less"
            }
        }
    },
    jslint: {
        client: {
            src: [
                'src/js/*.js'
            ],
            directives: {
              browser: true,
              predef: [
                'jQuery'
              ]
            }
        }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-less');

    // Load the plugin that provides the "jslint" task.
  grunt.loadNpmTasks('grunt-jslint');

  // Default task(s).
  grunt.registerTask('default', ['jslint', 'uglify', 'less']);

};
