import TwitchUser from './TwitchUser';
import { chance } from 'jest-chance';
import { GeneratedUserResult, generateUser } from '../../test/twitchUser.generator';

describe('The twitch user class', () => {
  describe('when creating only for a username', () => {
    test('it defaults the flags properly', () => {
      const actual = new TwitchUser(chance.word());

      expect(actual.mod()).toBeFalsy();
      expect(actual.subscriber()).toBeFalsy();
    });
  });
  describe('when creating from a complete tag list', () => {
    const zong = {
      'display-name': 'zonggestsu',
      mod: '0',
      subscriber: '1'
    };
    test('it can construct the user', () => {
      const actual = TwitchUser.from(zong);

      expect(actual.name()).toEqual('zonggestsu');
      expect(actual.mod()).toBeFalsy();
      expect(actual.subscriber()).toBeTruthy();
    });
  });

  chance.n(generateUser, 10).forEach((generatedUser: GeneratedUserResult) => {
    describe(`when the tag state is: mod: ${generatedUser.generated.mod}`, () => {
      describe(`and the sub status is sub: ${generatedUser.generated.subscriber}`, () => {
        test('it still parses the user correctly', () => {
          const actual = TwitchUser.from(generatedUser.generated);

          expect(actual).toEqual(generatedUser.expected);
        });
      });
    });
  });

});
