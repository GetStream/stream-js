import expect from 'expect.js';
import td from 'testdouble/dist/testdouble';

import { StreamFileStore } from '../../../src';
import { init, beforeEachFn } from '../utils/hooks';

describe('[UNIT] Files (Common)', function () {
  const uri = 'file_url';
  let post;
  let del;
  let store;

  init.call(this);
  beforeEach(beforeEachFn);
  beforeEach(function () {
    store = new StreamFileStore(this.client, 'token');
    post = td.function();
    del = td.function();

    td.replace(this.client, 'post', post);
    td.replace(this.client, 'delete', del);
  });

  afterEach(function () {
    td.reset();
  });

  it('#initialize', function () {
    expect(store.client).to.be(this.client);
    expect(store.token).to.be('token');
  });

  it('#delete', function () {
    store.delete(uri);

    td.verify(
      del({
        url: 'files/',
        qs: { url: uri },
        token: 'token',
      }),
    );
  });
});
