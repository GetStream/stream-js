var MochaSauce = require("mocha-sauce");
var connect = require("connect");
var serveStatic = require("serve-static");
var path = require("path");

var dir = path.normalize(path.join(__dirname, "../../"));

console.log("Starting webserver in dir", dir);

var app = connect().use(serveStatic(dir));
var server = app.listen(8080);

// configure
var sauce = new MochaSauce({
    name: "stream-js", // your project name
    username: process.env.SAUCE_USERNAME, // Sauce username
    accessKey: process.env.SAUCE_ACCESS_KEY, // Sauce access key
    host: "localhost", // or http://ondemand.sauce.com if not using Sauce Connect
    port: 4445, // 80

    // the test url
    url: "http://localhost:8080/test/browser/sauce.html", // point to the site running your mocha tests

    build: process.env.TRAVIS_JOB_NUMBER || 0,
});

// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });


sauce.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
  server.close();
});

sauce.start();
