var { CloudContext } = require('./utils');
var randUserId = require('../utils/hooks').randUserId;
var util = require('util');

function log(...args) {
    console.log(
        util.inspect(...args, { showHidden: false, depth: null, colors: true }),
    );
}

describe('Permission managament', () => {
    let ctx = new CloudContext();
    let policies;
    let fixedPolicies = [];
    let newPolicy;
    describe('When alice requests to see the policies', () => {
        ctx.requestShouldError(403, async () => {
            ctx.response = await ctx.alice.permissions.get();
        });
    });

    describe('When root requests to see the policy', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.root.permissions.get();
            policies = ctx.response;
            console.log(policies);
        });
    });

    describe('When alice tries to delete a default policy', () => {
        ctx.requestShouldError(403, async () => {
            await ctx.alice.permissions.delete(policies[1].priority);
        });
    });

    describe('When root tries to clear the default policies', () => {
        ctx.noRequestsShouldError(async () => {
            let deleteRequests = [];
            for (let p of policies) {
                if (p.priority > 0 && p.priority < 1000) {
                    deleteRequests.push(
                        ctx.root.permissions.delete(p.priority),
                    );
                } else {
                    fixedPolicies.push(p);
                }
            }
            await Promise.all(deleteRequests);
        });
        describe('and then requests to see the policies', () => {
            ctx.requestShouldNotError(async () => {
                ctx.response = await ctx.root.permissions.get();
                policies = ctx.response;
            });
            ctx.test('the policies should be there again', () => {
                policies.should.have.lengthOf.above(fixedPolicies.length);
            });
        });
    });

    describe('When root tries to overwrite a default policy', () => {
        ctx.requestShouldError(409, async () => {
            await ctx.root.permissions.add(policies[1]);
        });
    });

    describe('When root tries to delete a fixed policy', () => {
        ctx.requestShouldError(400, async () => {
            await ctx.root.permissions.delete(policies[0].priority);
        });
    });

    describe('When root tries to delete a single default policy', () => {
        ctx.requestShouldNotError(async () => {
            await ctx.root.permissions.delete(policies[1].priority);
        });
        describe('and then requests to see the policies', () => {
            ctx.requestShouldNotError(async () => {
                ctx.response = await ctx.root.permissions.get();
            });
            ctx.test('the policy should be removed', () => {
                ctx.response.should.have.lengthOf(policies.length - 1);
                ctx.response[1].should.eql(policies[2]);
            });
        });

        describe('and then root tries to add the policy again', () => {
            ctx.requestShouldNotError(async () => {
                await ctx.root.permissions.add(policies[1]);
            });
        });

        describe('and then requests to see the policies', () => {
            ctx.requestShouldNotError(async () => {
                ctx.response = await ctx.root.permissions.get();
            });
            ctx.test('the policy should be there again', () => {
                ctx.response.should.have.lengthOf(policies.length);
                ctx.response[1].priority.should.eql(policies[1].priority);
            });
        });
    });

});

describe('Permission checking', () => {
    let ctx = new CloudContext();
    ctx.createUsers();
    describe('When alice tries to impersonate bob', () => {
        let at = new Date().toISOString();
        ctx.requestShouldError(403, async () => {
            ctx.response = await ctx.alice.feed('user').addActivity({
                actor: ctx.bob.user,
                verb: 'eat',
                object: ctx.cheeseBurger,
                foreign_id: 'fid:123',
                time: at,
            });
        });
    });
    describe('When alice tries to create another user', () => {
        ctx.requestShouldError(403, async () => {
            ctx.response = await ctx.alice
                .getUser(randUserId('someone'))
                .create();
        });
    });
    describe('When alice tries to update bob', () => {
        ctx.requestShouldError(403, async () => {
            ctx.response = await ctx.alice
                .getUser(ctx.bob.userId)
                .update({ hacked: true });
        });
    });
    describe('When alice tries to delete bob', () => {
        ctx.requestShouldError(403, async () => {
            ctx.response = await ctx.alice
                .getUser(ctx.bob.userId)
                .update({ hacked: true });
        });
    });
});
