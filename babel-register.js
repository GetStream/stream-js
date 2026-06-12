/* eslint-disable import/no-extraneous-dependencies */

// Babel register hook used to run the unit suite on Node 16, where `tsx`
// (which requires Node >= 18) can't be used. Babel runs fine on Node 16, so we
// transpile `.ts`/`.js` on the fly to CommonJS here instead.
//
// One test (`test/unit/node/client_test.js`) uses `import.meta.url` with
// `createRequire` to read package.json. `tsx` rewrites `import.meta` for CJS,
// but Babel leaves it as-is, so we rewrite it ourselves. `createRequire`
// accepts a path, so mapping `import.meta` -> `{ url: __filename }` is enough.
function transformImportMeta({ template }) {
  return {
    visitor: {
      MetaProperty(path) {
        const { node } = path;
        if (node.meta && node.meta.name === 'import' && node.property.name === 'meta') {
          path.replaceWith(template.expression.ast('({ url: __filename })'));
        }
      },
    },
  };
}

require('@babel/register')({
  extensions: ['.js', '.ts'],
  babelrc: false,
  configFile: false,
  presets: [['@babel/preset-env', { targets: { node: '16' }, modules: 'commonjs' }], '@babel/preset-typescript'],
  plugins: [
    transformImportMeta,
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
  ],
});

require('dotenv').config();
