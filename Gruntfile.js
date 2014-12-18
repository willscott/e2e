/**
 * Gruntfile for e2e
 *
 * This repository builds the JavaScript crypto code from Google's end-to-end
 * project to provide the built library for other projects, so that it can be
 * easily depended on without having to rebuild the final project.
 **/

module.exports = function(grunt) {
  grunt.initConfig({
    gitclone: {
      e2e: {
        options: {
          repository: 'https://github.com/google/end-to-end.git'
        }
      }
    },

    gitpull: {
      e2e: {
        options: {
          cwd: 'end-to-end/'
        }
      }
    },

    // These shell commands execute/depend on do.sh in the e2e repo
    // Dependencies: unzip, svn, Python 2.X, Java >= 1.7
    shell: {
      doDeps: {
        command: 'bash ./end-to-end/do.sh install_deps'
      },
      doLib: {
        command: 'bash ./end-to-end/do.sh build_library'
      }
    },

    copy: {
      dist: {
        files: [ {
          src: ['end-to-end/build/library/end-to-end.compiled.js'],
          dest: 'end-to-end.compiled.js',
          onlyIf: 'modified'
        } ]
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-force');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('build', [
    'force:on',  // clone will fail if already exists, want to continue anyway
    'gitclone:e2e',
    'force:off',
    'gitpull:e2e',
    'shell:doDeps',
    'shell:doLib',
    'copy:dist'
  ]);

  grunt.registerTask('default', ['build']);
}
