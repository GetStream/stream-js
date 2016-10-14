var Mocha = require('mocha')
  , fs = require('fs')
  , path = require('path');

var mocha = new Mocha({

});

var testDirs = ['node', 'common'];

testDirs.forEach(function(dir) {
    dir = path.join(__dirname, '../test/unit/', dir);

    fs.readdirSync(dir)
     .filter(function(file) {
        return file.substr(-3) === '.js';
     })
     .forEach(function(file) {
        mocha.addFile(path.join(dir, file));
     });
});

/* istanbul ignore next */
mocha.run(function(failures) {
    process.on('exit', function() {
        process.exit(failures);
    });

    process.exit();
});
