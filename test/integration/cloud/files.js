var { CloudContext } = require('./utils');
var fs = require('fs');
var request = require('request');

describe('Files', () => {
  let ctx = new CloudContext();
  let fileURL;

  describe('When alice adds a new file', () => {
    ctx.requestShouldNotError(async () => {
      let file = fs.createReadStream('./test/integration/cloud/helloworld.txt');
      ctx.response = await ctx.alice.files.upload(file, 'helloworld.txt');
    });

    ctx.responseShould('have the expected content', () => {
      ctx.response.should.have.all.keys('file', 'duration');
      fileURL = ctx.response.file;
    });
  });

  describe('When alice adds a big file', () => {
    ctx.requestShouldError(413, async () => {
      let file = fs.createReadStream('./test/integration/cloud/toolarge2.jpeg');
      ctx.response = await ctx.alice.files.upload(file, 'toolarge2.jpeg');
    });
  });

  describe('When the file is requested', () => {
    ctx.test('should return 200', function(done) {
      request.get(fileURL, function(err, res) {
        res.statusCode.should.eql(200);
        done();
      });
    });
  });

  describe("When bob tries to delete alice's file", () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.bob.files.delete(fileURL);
    });
  });

  describe('When alice deletes an existing file', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.files.delete(fileURL);
    });
  });

  describe('When alice deletes an already deleted file', () => {
    ctx.requestShouldError(404, async () => {
      ctx.response = await ctx.alice.files.delete(fileURL);
    });
  });
});
