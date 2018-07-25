var { CloudContext } = require('./utils');
var randUserId = require('../utils/hooks').randUserId;

describe('Object Store CRUD behaviours', () => {
    let ctx = new CloudContext();
    let improvedCheeseBurgerData = {
        name: 'The improved cheese burger',
        toppings: ['cheese', 'pickles', 'bacon'],
    };
    ctx.aliceAddsCheeseBurger();

    describe('When alice tries to get the cheeseburger', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice.storage('food').get(ctx.cheeseBurger.id);
            ctx.prevResponse = ctx.response;
        });

        ctx.responseShould(
            'be the same as when the cheeseburger was added',
            async () => {
                ctx.response.should.eql(ctx.cheeseBurger.full);
            },
        );
    });

    describe('When bob tries to get the cheeseburger', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.bob.storage('food').get(ctx.cheeseBurger.id);
        });

        ctx.responseShouldEqualPreviousResponse();
    });

    describe('When bob tries to add the improved cheeseburger with the same ID', () => {
        ctx.requestShouldError(409, async () => {
            ctx.response = await ctx.bob
                .storage('food')
                .add(ctx.cheeseBurger.id, improvedCheeseBurgerData);
        });
    });

    describe('When alice tries to add the improved cheeseburger with the same ID', () => {
        ctx.requestShouldError(409, async () => {
            ctx.response = await ctx.alice
                .storage('food')
                .add(ctx.cheeseBurger.id, improvedCheeseBurgerData);
        });
    });

    describe('When bob tries to update the cheeseburger', () => {
        ctx.requestShouldError(403, async () => {
            ctx.response = await ctx.bob
                .storage('food')
                .update(ctx.cheeseBurger.id, improvedCheeseBurgerData);
        });
    });

    describe('When alice tries to update the cheeseburger', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice
                .storage('food')
                .update(ctx.cheeseBurger.id, improvedCheeseBurgerData);
        });
        ctx.responseShouldHaveNewUpdatedAt();
    });

    describe('When alice then tries to get the cheeseburger', () => {
        ctx.requestShouldNotError(async () => {
            ctx.prevResponse = ctx.response;
            ctx.response = await ctx.alice.storage('food').get(ctx.cheeseBurger.id);
        });

        ctx.responseShouldEqualPreviousResponse();
    });

    describe('When alice tries to change the ID of cheeseburger in an update call', () => {
        ctx.requestShouldError(400, async () => {
            let storage = ctx.alice.storage('food');
            var body = {
                id: 1234,
                data: improvedCheeseBurgerData,
            };
            await storage.client.put({
                url: storage.buildURL(ctx.cheeseBurger.id),
                body: body,
                signature: storage.signature,
            });
        });
    });

    describe('When bob tries to delete the cheeseburger', () => {
        ctx.requestShouldError(403, async () => {
            ctx.response = await ctx.bob.storage('food').delete(ctx.cheeseBurger.id);
        });
    });

    describe('When alice tries to delete the cheeseburger', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice.storage('food').delete(ctx.cheeseBurger.id);
        });

        ctx.responseShould("be empty JSON", async () => {
            ctx.response.should.eql({});
        });
    });

    describe('When alice then tries to get the cheeseburger', () => {
        ctx.requestShouldError(404, async () => {
            await ctx.alice.storage('food').get(ctx.cheeseBurger.id);
        });
    });

    describe('When alice tries to create an object with an illegal character in the id', () => {
        ctx.requestShouldError(400, async () => {
            await ctx.alice.storage('food').add('!abcdee!', {});
        });
    });

    let newCheeseBurger;

    describe('When alice tries to add a new cheeseburger with a provided ID', () => {
        let newCheeseBurgerID = randUserId('cheeseburger');
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice
                .storage('food')
                .add(newCheeseBurgerID, ctx.cheeseBurgerData);
        });

        ctx.responseShouldHaveFields(...ctx.fields.collection);

        ctx.responseShould(
            'have ID, collection and data matching the request',
            () => {
                ctx.response.id.should.equal(newCheeseBurgerID);
                ctx.response.collection.should.equal('food');
                ctx.response.data.should.eql(ctx.cheeseBurgerData);
            },
        );

        ctx.afterTest(() => {
            newCheeseBurger = ctx.response;
        });
    });

    describe('When alice tries to get the new cheeseburger', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice.storage('food').get(newCheeseBurger.id);
        });
        ctx.responseShould(
            'be the same as when the new cheeseburger was added',
            async () => {
                ctx.response.should.eql(newCheeseBurger);
            },
        );
    });
});
