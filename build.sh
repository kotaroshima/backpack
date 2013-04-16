coffee -c -o . ./coffee/
coffee -j Backpack.js -c ./coffee/Backpack.coffee ./coffee/plugins/Attachable.coffee ./coffee/plugins/Subscribable.coffee ./coffee/plugins/Publishable.coffee
coffee -j Backpack-all.js -c ./coffee/Backpack.coffee ./coffee/plugins/*.coffee ./coffee/components/*.coffee