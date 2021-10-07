import expect from 'expect.js';
import td from 'testdouble/dist/testdouble';

import { StreamImageStore } from '../../../src';
import { init, beforeEachFn } from '../utils/hooks';

describe('[UNIT] Images (Common)', function () {
  const uri = 'file_url';
  let get;
  let post;
  let del;
  let store;

  init.call(this);
  beforeEach(beforeEachFn);
  beforeEach(function () {
    store = new StreamImageStore(this.client, 'token');
    post = td.function();
    del = td.function();
    get = td.function();

    td.replace(this.client, 'get', get);
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

  it('#process', function () {
    const options = { crop: 'bottom', resize: 'scale', h: 100, w: 100 };
    store.process(uri, options);

    td.verify(
      get({
        url: 'images/',
        qs: { url: uri, ...options },
        token: 'token',
      }),
    );
  });

  it('#thumbnail', function () {
    store.thumbnail(uri, '200', '200');

    td.verify(
      get({
        url: 'images/',
        qs: { url: uri, crop: 'center', resize: 'clip', h: '200', w: '200' },
        token: 'token',
      }),
    );
  });

  it('#delete', function () {
    store.delete(uri);

    td.verify(
      del({
        url: 'images/',
        qs: { url: uri },
        token: 'token',
      }),
    );
  });
});
