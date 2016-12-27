var fs = require('fs')
  , packageJSON = require('../package.json')
  , bowerJSON = require('../bower.json');
  
var version = packageJSON.version;
var versionName = 'v' + version;

var message = 'Released version ' + versionName;

console.log('Updating bower.json', message);

bowerJSON.version = version;

fs.writeFileSync('bower.json', JSON.stringify(bowerJSON, null, '  '));