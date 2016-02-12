module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: { separator: ';'},
      dist: {
        src: ['public/client/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['public/dist/<%= pkg.name %>.js'],
          'public/dist/lib/backbone.min.js': ['public/lib/backbone.js'],
          'public/dist/lib/handlebars.min.js': ['public/lib/handlebars.js'],
          'public/dist/lib/jquery.min.js': ['public/lib/jquery.js'],
          'public/dist/lib/underscore.min.js': ['public/lib/underscore.js'],
        }
      }
    },

    eslint: {
      target: [
        'public/**/*.js',
        'app/**/*.js',
        'lib/*.js',
        '*.js'
      ]
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css' : ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify',
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push live master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  // grunt.registerTask('upload', function(n) {
  //   if (grunt.option('prod')) {
  //     // add your production server task here
  //   }
  //   grunt.task.run([ 'server-dev' ]);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'eslint',
    'test'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      console.log('proddddd');
      grunt.task.run('shell:prodServer');
      // git push live master
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function(n) {
    grunt.task.run('build');

    if (grunt.option('prod')) {
      console.log('the prod option for deploy works', grunt.option('prod'));
      // grunt.option.init('prod');
      grunt.task.run(['upload']); // does this syntax work?
    } else {
      grunt.task.run(['upload']);
    }
  }

   // [
   //  // add your deploy tasks here
   //  'eslint',
   //  'test',
   //  // if grunt option prod (deploy -- prod) then (upload --prod)
   //  'upload']
  );


};
