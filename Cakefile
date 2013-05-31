util = require('util')
exec = require('child_process').exec

task 'build', 'Builds CoffeeScript files into JavaScript files', (options)->
  util.log('Start build...')
  exec 'coffee -c -o . ./coffee/', (error, stdout, stderr)->
    if error
      util.log('Build fail : '+error)
    else
      exec 'coffee -j Backpack.js -c ./coffee/Backpack.coffee ./coffee/plugins/AttachPlugin.coffee ./coffee/plugins/SubscribePlugin.coffee ./coffee/plugins/PublishPlugin.coffee', (error, stdout, stderr)->
        if error
          util.log('Build fail : '+error)
        else
          exec 'coffee -j Backpack-all.js -c ./coffee/Backpack.coffee ./coffee/plugins/*.coffee ./coffee/components/StackView.coffee ./coffee/components/ListView.coffee ./coffee/components/EditableListView.coffee', (error, stdout, stderr)->
            if error
              util.log('Build fail : '+error)
            else
              util.log('Build success')

task 'build-css', 'Builds SCSS files into CSS files', (options)->
  util.log('Start build...')
  exec 'scss scss/EditableListView.scss css/EditableListView.css -t expanded', (error, stdout, stderr)->
    if error
      util.log('Build fail : '+error)
    else
      util.log('Build success')