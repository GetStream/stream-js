import expect from 'expect.js';

import { init, beforeEachFn } from '../utils/hooks';

describe('[INTEGRATION] Stream client (Browser)', function () {
  init.call(this);
  beforeEach(beforeEachFn);

  it('add activity using to', function () {
    const activity = {
      actor: 1,
      verb: 'add',
      object: 1,
      to: [this.flat3.id],
      participants: ['Thierry', 'Tommaso'],
      route: {
        name: 'Vondelpark',
        distance: '20',
      },
    };

    return this.user1
      .addActivity(activity)
      .then((body) => {
        activity.id = body.id;
        return this.flat3.get({ limit: 1 });
      })
      .then((body) => {
        expect(body.results[0].id).to.eql(activity.id);
      });
  });
});
