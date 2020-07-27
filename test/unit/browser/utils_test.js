import FormData from 'form-data';
import expect from 'expect.js';

import utils from '../../../src/utils';
import { init } from '../utils/hooks';

function mockedFile(size = 1024, name = 'mockfile.txt', mimeType = 'plain/txt') {
  return new File(['x'.repeat(size)], name, { type: mimeType });
}

describe('[UNIT] Utility functions (browser)', function () {
  init.call(this);

  describe('addFileToFormData', function () {
    const file = mockedFile(1024, 'helloworld.jpg', 'image/jpg');

    it('should return a valid form data', function () {
      expect(utils.addFileToFormData(file)).to.be.a(FormData);
      expect(utils.addFileToFormData(file, 'helloworld.jpg')).to.be.a(FormData);
    });
  });
});
