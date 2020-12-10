import { CloudContext } from './utils';
import { randUserId } from '../utils/hooks';

describe('Collection CRUD behaviours', () => {
  const ctx = new CloudContext();
  const improvedCheeseBurgerData = {
    name: 'The improved cheese burger',
    toppings: ['cheese', 'pickles', 'bacon'],
  };
  ctx.aliceAddsCheeseBurger();

  describe('When alice tries to get the cheeseburger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.collections.get('food', ctx.cheeseBurger.id);
      ctx.prevResponse = ctx.response;
    });

    ctx.responseShould('be the same as when the cheeseburger was added', async () => {
      ctx.shouldEqualBesideDuration(ctx.response.full, ctx.cheeseBurger.full);
    });
  });

  describe('When bob tries to get the cheeseburger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.collections.get('food', ctx.cheeseBurger.id);
    });

    ctx.responseShouldEqualPreviousResponse();
  });

  describe('When bob tries to add the improved cheeseburger with the same ID', () => {
    ctx.requestShouldError(409, async () => {
      ctx.response = await ctx.bob.collections.add('food', ctx.cheeseBurger.id, improvedCheeseBurgerData);
    });
  });

  describe('When alice tries to add the improved cheeseburger with the same ID', () => {
    ctx.requestShouldError(409, async () => {
      ctx.response = await ctx.alice.collections.add('food', ctx.cheeseBurger.id, improvedCheeseBurgerData);
    });
  });

  describe('When bob tries to update the cheeseburger', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.bob.collections.update('food', ctx.cheeseBurger.id, improvedCheeseBurgerData);
    });
  });

  describe('When alice tries to update the cheeseburger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.collections.update('food', ctx.cheeseBurger.id, improvedCheeseBurgerData);
    });
    ctx.responseShouldHaveNewUpdatedAt();
  });

  describe('When alice then tries to get the cheeseburger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.prevResponse = ctx.response;
      ctx.response = await ctx.alice.collections.get('food', ctx.cheeseBurger.id);
    });

    ctx.responseShouldEqualPreviousResponse();
  });

  describe('When alice tries to change the ID of cheeseburger in an update call', () => {
    ctx.requestShouldError(400, async () => {
      const body = {
        id: 1234,
        data: improvedCheeseBurgerData,
      };
      await ctx.alice.collections.client.put({
        url: ctx.alice.collections.buildURL('food', ctx.cheeseBurger.id),
        body,
        token: ctx.alice.collections.token,
      });
    });
  });

  describe('When bob tries to delete the cheeseburger', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.bob.collections.delete('food', ctx.cheeseBurger.id);
    });
  });

  describe('When alice tries to delete the cheeseburger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.collections.delete('food', ctx.cheeseBurger.id);
    });

    ctx.responseShould('be empty JSON', async () => {
      const response = { ...ctx.response };
      delete response.duration;
      response.should.eql({});
    });
  });

  describe('When alice then tries to get the cheeseburger', () => {
    ctx.requestShouldError(404, async () => {
      await ctx.alice.collections.get('food', ctx.cheeseBurger.id);
    });
  });

  describe('When alice tries to create an object with an illegal character in the id', () => {
    ctx.requestShouldError(400, async () => {
      await ctx.alice.collections.add('food', '!abcdee!', {});
    });
  });

  let newCheeseBurger;

  describe('When alice tries to add a new cheeseburger with a provided ID', () => {
    const newCheeseBurgerID = randUserId('cheeseburger');
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.collections.add('food', newCheeseBurgerID, ctx.cheeseBurgerData);
    });

    ctx.responseShouldHaveFields(...ctx.fields.collection);

    ctx.responseShould('have ID, collection and data matching the request', () => {
      ctx.response.id.should.equal(newCheeseBurgerID);
      ctx.response.collection.should.equal('food');
      ctx.response.data.should.eql(ctx.cheeseBurgerData);
    });

    ctx.afterTest(() => {
      newCheeseBurger = ctx.response;
    });
  });

  describe('When alice tries to get the new cheeseburger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.collections.get('food', newCheeseBurger.id);
    });

    ctx.test('be the same data as before', () => {
      ctx.shouldEqualBesideDuration(ctx.response.full, newCheeseBurger.full);
    });
  });

  describe('When alice deletes the cheeseburger', () => {
    let replacementBurger;

    ctx.requestShouldNotError(async () => {
      replacementBurger = Object.assign(newCheeseBurger.full, {
        data: { wopper: true },
      });
      ctx.response = await ctx.alice.collections.delete('food', newCheeseBurger.id);
    });

    describe('When alice gets the deleted cheeseburger', () => {
      ctx.requestShouldError(404, async () => {
        ctx.response = await ctx.alice.collections.get('food', newCheeseBurger.id);
      });
    });

    describe('When alice inserts a new cheeseburger with same ID as before', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.collections.add('food', replacementBurger.id, replacementBurger.data);
      });
    });

    describe('When alice reads the new cheeseburger', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.collections.get('food', replacementBurger.id);
      });

      ctx.test('be the same data as before', () => {
        const response = ctx.response.full;
        response.data.should.eql(replacementBurger.data);
        response.id.should.eql(replacementBurger.id);
        response.updated_at.should.not.eql(newCheeseBurger.updated_at);
      });
    });
  });

  describe('When alice tries to add an object with a string as data', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.collections.add('food', null, 'some string');
    });
  });

  describe('When alice tries to add an object with empty data', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.collections.add('food', null, {});
    });
  });
});
