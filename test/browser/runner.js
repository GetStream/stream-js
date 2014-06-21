var MochaSauce = require("mocha-sauce");

// configure
var sauce = new MochaSauce({
    name: "getstream", // your project name
    username: "tschellenbach", // Sauce username
    accessKey: "982137a0-d75d-4cd8-a6c3-1a497e97a277", // Sauce access key
    host: "http://ondemand.sauce.com", // or http://ondemand.sauce.com if not using Sauce Connect
    port: 80, // 80
    // the test url
    url: "https://saucelabs.com/test_helpers/front_tests/index.html" // point to the site running your mocha tests
});


// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });
sauce.browser({ browserName: "firefox", platform: "Windows XP" });


sauce.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start();