var { CloudContext } = require('./utils');
var expect = require('chai').expect;

describe('Read followers', () => {
	let ctx = new CloudContext();

	let bobData = {
		name: "Robert",
	};

	let carlData = {
		name:"Carl",
	};

	before(async function() {
		await Promise.all([
			ctx.bob.user.create(bobData),
			ctx.carl.user.create(carlData),
			ctx.bob.followUser(ctx.alice.user),
			ctx.carl.followUser(ctx.alice.user),
			ctx.dave.followUser(ctx.alice.user),
		]);
		ctx.response = await ctx.alice.feed('user').followers();
	});

	describe('When alice reads the list of followers', async () => {

		ctx.responseShould("have 3", () => {
			expect(ctx.response.results).to.have.lengthOf(3);
		});

		ctx.responseShould("should include a user key with bob and carl", () => {
			ctx.response.should.have.property('users');
			ctx.response.users[ctx.bob.user.id].data.should.eql(bobData);
			ctx.response.users[ctx.carl.user.id].data.should.eql(carlData);
		});

	});

});

describe('Read followings', () => {
	let ctx = new CloudContext();

	let bobData = {
		name: "Robert",
	};

	let carlData = {
		name:"Carl",
	};

	before(async function() {
		await Promise.all([
			ctx.bob.user.create(bobData),
			ctx.carl.user.create(carlData),
			ctx.alice.followUser(ctx.bob.user),
			ctx.alice.followUser(ctx.carl.user),
			ctx.alice.followUser(ctx.dave.user),
		]);
		ctx.response = await ctx.alice.feed('timeline').following();
	});

	describe('When alice reads the list of followings', async () => {

		ctx.responseShould("have 3", () => {
			expect(ctx.response.results).to.have.lengthOf(3);
		});

		ctx.responseShould("should include a user key with bob and carl", () => {
			ctx.response.should.have.property('users');
			ctx.response.users[ctx.bob.user.id].data.should.eql(bobData);
			ctx.response.users[ctx.carl.user.id].data.should.eql(carlData);
		});

	});

});
