util = require('util')
exec = require('child_process').exec

task 'build', 'Builds CoffeeScript files into JavaScript files', (options)->
  util.log('Start build...')
  exec 'coffee -c -o . ./coffee/', (error, stdout, stderr)->
    if error
      util.log('Build fail')
    else
      exec 'coffee -j Backpack.js -c ./coffee/Backpack.coffee ./coffee/plugins/AttachPlugin.coffee ./coffee/plugins/SubscribePlugin.coffee ./coffee/plugins/PublishPlugin.coffee', (error, stdout, stderr)->
        if error
          util.log('Build fail')
        else
          exec 'coffee -j Backpack-all.js -c ./coffee/Backpack.coffee ./coffee/plugins/*.coffee ./coffee/components/*.coffee', (error, stdout, stderr)->
            if error
              util.log('Build fail')
            else
              util.log('Build success')
