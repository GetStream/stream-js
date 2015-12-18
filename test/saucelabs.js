var MochaSauce = require("mocha-sauce");
var connect = require("connect");
var serveStatic = require("serve-static");
var Canvas = require('term-canvas');
var path = require("path");
var size = process.stdout.getWindowSize();

var dir = path.normalize(path.join(__dirname, "../"));

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

    build: process.env.TRAVIS_JOB_NUMBER,
});

sauce.concurrency(2);

// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });
sauce.browser({ browserName: "safari", platform: "OS X 10.11" });
// sauce.browser({ browserName: "firefox", platform: "Windows 7" });
// Firefox doesn't terminate somehow -_- 

sauce.browser({ browserName: "internet explorer", platform: "Windows 8", version: "10" });
sauce.browser({ browserName: "internet explorer", platform: "Windows 7", version: "11" });
sauce.browser({ browserName: "internet explorer", platform: "Windows 7", version: "10" });
sauce.browser({ browserName: "internet explorer", platform: "Windows 7", version: "9" });

var canvas = new Canvas(size[0], size[1]);
var ctx = canvas.getContext('2d');
ctx.reset();

var grid = new MochaSauce.GridView(sauce, ctx);
grid.size(canvas.width, canvas.height);

ctx.hideCursor();

process.on('SIGINT', function() {
  ctx.reset();
  process.nextTick(function() {
    process.exit();
  });
});

sauce.start(function(err, res) {
  if(err) {
    console.error('failed with error: ');
    console.error('    ', err.message.split('\n').join('\n    '));
    console.error('    ', err.data.split('\n').join('\n    '));
  } else {
    grid.showFailures();
    setTimeout(function() {
      ctx.showCursor();
      process.exit(grid.totalFailures);
    }, 100);
  }

  server.close();
});
