import fs from 'fs';
import request from 'request';

import { CloudContext } from './utils';

describe('Images', () => {
  const ctx = new CloudContext();
  let imageUrl;

  describe('When alice adds a txt file as image', () => {
    ctx.requestShouldError(400, async () => {
      const file = fs.createReadStream('./test/integration/cloud/helloworld.txt');
      ctx.response = await ctx.alice.images.upload(file, 'helloworld.txt');
    });
    ctx.responseShould('have useful error message', () => {
      ctx.response.detail.should.equal('File type application/octet-stream is not supported');
    });
  });

  describe('When alice adds a new image', () => {
    ctx.requestShouldNotError(async () => {
      const file = fs.createReadStream('./test/integration/cloud/helloworld.jpg');
      ctx.response = await ctx.alice.images.upload(file, 'helloworld.jpg');
    });

    ctx.responseShould('have the expected content', () => {
      ctx.response.should.have.all.keys('file', 'duration');
      imageUrl = ctx.response.file;
    });

    describe('When alice process an image with bad params', () => {
      ctx.requestShouldError(400, async () => {
        ctx.response = await ctx.alice.images.process(imageUrl, {
          crop: 'impossible',
        });
      });
      ctx.requestShouldError(400, async () => {
        ctx.response = await ctx.alice.images.process(imageUrl, { w: -1 });
      });
      ctx.requestShouldError(400, async () => {
        ctx.response = await ctx.alice.images.process(imageUrl, { h: -1 });
      });
      ctx.requestShouldError(400, async () => {
        ctx.response = await ctx.alice.images.process(imageUrl, {
          resize: 'impossible',
        });
      });
    });
  });

  describe('When the image {imageUrl} is requested', () => {
    ctx.test('should return 200', function (done) {
      request.get(imageUrl, function (err, res) {
        res.statusCode.should.eql(200);
        done();
      });
    });
  });

  describe('When alice creates a thumbnail 50x50', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.images.thumbnail(imageUrl, 50, 50);
    });
    ctx.responseShould('have the expected content', () => {
      ctx.response.should.have.all.keys('file', 'duration');
      imageUrl = ctx.response.file;
    });
    ctx.test('When the image is requested it should return 200', function (done) {
      request.get(imageUrl, function (err, res) {
        res.statusCode.should.eql(200);
        done();
      });
    });
  });

  describe('When alice creates a crop bottom 75x50', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.images.process(imageUrl, {
        w: 75,
        h: 50,
        crop: 'bottom',
        resize: 'crop',
      });
    });
    ctx.responseShould('have the expected content', () => {
      ctx.response.should.have.all.keys('file', 'duration');
      imageUrl = ctx.response.file;
    });
    ctx.test('When the image is requested it should return 200', function (done) {
      request.get(imageUrl, function (err, res) {
        res.statusCode.should.eql(200);
        done();
      });
    });
  });

  describe("When bob tries to crop alice's image", () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.bob.images.process(imageUrl, {
        w: 75,
        h: 50,
        crop: 'bottom,right',
        resize: 'crop',
      });
    });
  });

  describe('When alice creates a scaled thumb 140x30', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.images.process(imageUrl, {
        w: 140,
        h: 30,
        resize: 'scale',
      });
    });
    ctx.responseShould('have the expected content', () => {
      ctx.response.should.have.all.keys('file', 'duration');
      imageUrl = ctx.response.file;
    });
    ctx.test('When the image is requested it should return 200', function (done) {
      request.get(imageUrl, function (err, res) {
        res.statusCode.should.eql(200);
        done();
      });
    });
  });

  describe("When bob tries to delete alice's image", () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.bob.images.delete(imageUrl);
    });
  });

  describe('When alice deletes an existing image', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.images.delete(imageUrl);
    });
  });

  describe('When alice deletes an already deleted image', () => {
    ctx.requestShouldError(404, async () => {
      ctx.response = await ctx.alice.images.delete(imageUrl);
    });
  });
});
