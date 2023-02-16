{
  "presets": [
    [
      "@babel/preset-env", 
      { 
        "modules": false, 
        "targets": { "browsers": ["last 2 versions", "ie >= 10"] } 
      }
    ],
    "@babel/preset-typescript",
  ],
  "sourceType": "unambiguous",
  "plugins": [
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-transform-runtime",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
    ["babel-plugin-add-import-extension", { extension: "mjs", replace: true }],
    [    
      "transform-inline-environment-variables", {
      "include": [ "PACKAGE_VERSION" ]
    }]
  ],
  "ignore": ["node_modules", "dist", "lib"]
}
