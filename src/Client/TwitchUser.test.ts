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
      'badges': 'subscriber/3',
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

  describe('when dealing with the broadcaster', () => {
    const streamer = {
      '@badge-info': 'subscriber/30',
      'badges': 'broadcaster/1,subscriber/3',
      color: '#22AAA4',
      'display-name': 'vsbMeza3',
      emotes: '',
      flags: '',
      id: '92994604-094a-4b01-bef1-db7cf9b05b37',
      mod: '0',
      'room-id': '72930026',
      'subscriber': '1',
      'tmi-sent-ts': '1576807789577',
      'turbo': '0',
      'user-id': '72930026',
      'user-type': ''
    };
    test('it parses as a mod and a subscriber', () => {
      const actual = TwitchUser.from(streamer);

      expect(actual.name()).toEqual('vsbMeza3');
      expect(actual.mod()).toBeTruthy();
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
