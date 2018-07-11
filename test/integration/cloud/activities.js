var { CloudContext } = require('./utils');

describe('Get activities', () => {
	let ctx = new CloudContext();
	ctx.aliceAddsCheeseBurger();

	describe('When alice eats the cheese burger', () => {
		let at = new Date().toISOString();

		ctx.requestShouldNotError(async () => {
			ctx.response = await ctx.alice.feed('user').addActivity({
				actor: ctx.alice.userId,
				verb: 'eat',
				object: `SC:food:${ctx.cheeseBurger.id}`,
				foreign_id: 'fid:123',
				time: at
			});
		});

		it("Should be possible to read the same activity by ID", async () => {
			let response = await ctx.alice.feed('user').getActivityDetail([ctx.response.id]);
			let activity = response.results[0];
			activity.should.have.property('foreign_id');
			activity.actor.should.equal(ctx.alice.userId);
			activity.verb.should.equal('eat');
			activity.object.data.should.eql(ctx.cheeseBurgerData);
			// activity.object.collection.should.equal('food');
			// activity.object.data.name.should.equal('cheese burger');
		});
	});

});
