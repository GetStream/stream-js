var { CloudContext } = require('./utils');
var fs = require('fs');
var request = require('request');

describe('Images', () => {
    let ctx = new CloudContext();
    let imageUrl;

    describe('When alice adds a new image', () => {
        ctx.requestShouldNotError(async () => {
            let file = fs.createReadStream(
                './test/integration/cloud/helloworld.jpg',
            );
            ctx.response = await ctx.alice.images.upload(
                file,
                'helloworld.txt',
            );
        });

        ctx.responseShould('have the expected content', () => {
            ctx.response.should.have.all.keys('file');
            imageUrl = ctx.response.file;
        });
    });

    describe('When the image ${imageUrl} is requested', () => {
        ctx.test('should return 200', function(done) {
            request.get(imageUrl, function(err, res, body) {
                res.statusCode.should.eql(200);
                done();
            });
        });
    });

    describe('When alice creates a thumbmail 50x50', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice.images.thumbmail(imageUrl, {
                w: 50,
                h: 50,
            });
            ctx.responseShould('have the expected content', () => {
                ctx.response.should.have.all.keys('file');
                imageUrl = ctx.response.file;
            });
        });
    });

    describe('When the thumbnail is requested', () => {
        it('should return 200', function(done) {
            request.get(imageUrl, function(err, res, body) {
                res.statusCode.should.eql(200);
                done();
            });
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
            console.log(ctx.response);
        });
    });
});
