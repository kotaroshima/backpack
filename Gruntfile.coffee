module.exports = (grunt) ->

  require('load-grunt-tasks') grunt

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    watch:
      scripts:
        files: ['coffee/**/*.coffee']
        tasks: ['coffee','uglify']
      styles:
        files: ['scss/**/*.scss']
        tasks: ['sass']
    coffee:
      each:
        expand: true
        cwd: 'coffee'
        src: ['**/*.coffee','!Backpack.coffee'],
        dest: '.',
        ext: '.js'
      base:
        options:
          join: true
        files:
          'Backpack.js': [
            'coffee/Backpack.coffee'
            'coffee/plugins/AttachPlugin.coffee'
            'coffee/plugins/SubscribePlugin.coffee'
            'coffee/plugins/PublishPlugin.coffee'
          ]
      all:
        options:
          join: true
        files:
          'Backpack-all.js': [
            'coffee/Backpack.coffee'
            'coffee/plugins/*.coffee'
            'coffee/components/ActionView.coffee'
            'coffee/components/StackView.coffee'
            'coffee/components/ListView.coffee'
            'coffee/components/EditableListView.coffee'
            'coffee/components/TabView.coffee'
            'coffee/components/GoogleMapView.coffee'
          ]
    uglify:
      base:
        files:
          'Backpack.min.js': ['Backpack.js']
      all:
        files:
          'Backpack-all.min.js': ['Backpack-all.js']
    sass:
      all:
        expand: true
        cwd: 'scss'
        src: ['**/*.scss'],
        dest: 'css',
        ext: '.css'

  grunt.registerTask 'default', ['coffee','uglify','sass']
