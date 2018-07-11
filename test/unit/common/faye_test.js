var expect = require('expect.js'),
  beforeEachFn = require('../utils/hooks').beforeEach,
  init = require('../utils/hooks').init,
  Faye = require('faye');

describe('[UNIT] Faye (browser)', function() {
  init.call(this);
  beforeEach(beforeEachFn);

  it('#getFayeAuthorization', function() {
    var self = this;
    var auth = this.client.getFayeAuthorization();

    expect(auth.incoming).to.be.a(Function);
    expect(auth.outgoing).to.be.a(Function);

    auth.incoming('matthisk', function(message) {
      expect(message).to.be('matthisk');
    });

    this.client.subscriptions['test'] = {
      userId: 'matthisk',
      token: 'token',
    };

    auth.outgoing({ subscription: 'test' }, function(message) {
      expect(message.ext.user_id).to.be('matthisk');
      expect(message.ext.api_key).to.be(self.client.apiKey);
      expect(message.ext.signature).to.be('token');
    });
  });

  it('#getFayeClient', function() {
    var client = this.client.getFayeClient();

    expect(client).to.be.a(Faye.Client);
  });
});
