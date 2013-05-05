util = require('util')
exec = require('child_process').exec

task 'build', 'Builds CoffeeScript files into JavaScript files', (options)->
  util.log('Start build...')
  exec 'coffee -c -o . ./coffee/', (error, stdout, stderr)->
    if error
      util.log('Build fail')
    else
      exec 'coffee -j Backpack.js -c ./coffee/Backpack.coffee ./coffee/plugins/Attachable.coffee ./coffee/plugins/Subscribable.coffee ./coffee/plugins/Publishable.coffee', (error, stdout, stderr)->
        if error
          util.log('Build fail')
        else
          exec 'coffee -j Backpack-all.js -c ./coffee/Backpack.coffee ./coffee/plugins/*.coffee ./coffee/components/*.coffee', (error, stdout, stderr)->
            if error
              util.log('Build fail')
            else
              util.log('Build success')
