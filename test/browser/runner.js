var MochaSauce = require("mocha-sauce");
var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');

// setup a webserver to run the tests against
var directory = path.normalize(path.join(__dirname, '../../'));
console.log('starting webserver in dir ', directory);
app = connect().use(serveStatic(directory));
server = app.listen(8080);

// configure
var sauce = new MochaSauce({
    name: "getstream", // your project name
    username: "tschellenbach", // Sauce username
    accessKey: "982137a0-d75d-4cd8-a6c3-1a497e97a277", // Sauce access key
    host: "127.0.0.1", // or http://ondemand.sauce.com if not using Sauce Connect
    port: 4445, // 80
    // the test url
    url: "http://127.0.0.1:8080/test/browser/sauce.html/", // point to the site running your mocha tests
    build: process.env.TRAVIS_JOB_NUMBER
});


// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });
sauce.browser({ browserName: "firefox", platform: "Windows XP" });
sauce.browser({ browserName: "internet explorer", platform: "Windows 8.1", version: 11 });
sauce.browser({ browserName: "internet explorer", platform: "Windows 8", version: 10 });

sauce.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start(function completed() {
    console.log('done with the sauce, giving it back');
    server.close();
});
