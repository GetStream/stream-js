import FormData from 'form-data';
import expect from 'expect.js';
import fs from 'fs';

import utils from '../../../src/utils';
import { init } from '../utils/hooks';

describe('[UNIT] Utility functions (node)', function () {
  init.call(this);

  describe('addFileToFormData', function () {
    it('should return a valid form data', function () {
      const file = fs.createReadStream('../../integration/cloud/helloworld.jpg');

      expect(utils.addFileToFormData(file)).to.be.a(FormData);
      expect(utils.addFileToFormData(file, 'helloworld.jpg')).to.be.a(FormData);
      expect(utils.addFileToFormData(file, 'helloworld.jpg', 'image/jpg')).to.be.a(FormData);
    });

    it('should set proper headers', function () {
      const file = fs.createReadStream('../../integration/cloud/helloworld.jpg');
      const fd = utils.addFileToFormData(file);
      const headers = fd.getHeaders();

      expect(headers).to.have.key('content-type');
      expect(headers['content-type']).to.contain('multipart/form-data;');
      expect(headers['content-type']).to.contain('boundary=');
    });

    it('should set proper headers with content type', function () {
      const file = fs.createReadStream('../../integration/cloud/helloworld.jpg');
      const fd = utils.addFileToFormData(file, 'helloworld.jpg', 'image/jpg');
      const headers = fd.getHeaders();

      expect(headers).to.have.key('content-type');
      expect(headers['content-type']).to.contain('multipart/form-data;');
      expect(headers['content-type']).to.contain('boundary=');
    });
  });
});
