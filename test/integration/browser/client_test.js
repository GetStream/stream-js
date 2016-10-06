var beforeEachFn = require('../utils/hooks').beforeEach
  , expect = require('expect.js')
  , init = require('../utils/hooks').init;

describe('Stream client (Browser)', function() {

    init.call(this);
    beforeEach(beforeEachFn);

    it('shouldn\'t support signed requests on the client', function() {
      expect(this.client.makeSignedRequest).to.be(undefined);
    });

});