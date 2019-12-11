import { chance } from 'jest-chance';
import TwitchChannel from './TwitchChannel';

const mockSay = jest.fn();

let mockTwitchClientInstance;
describe('The Twitch Channel class', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockTwitchClientInstance = {
      say: mockSay
    };
  });
  describe('when asking for the name', () => {
    describe('and the name did not have a # in it', () => {
      const randomName = chance.word();

      test('it returns it', () => {
        const channel = new TwitchChannel(randomName, mockTwitchClientInstance);
        expect(channel.name()).toEqual('#' + randomName);
      });
    });
    describe('and the name has a # in it', () => {
      const randomName = '#' + chance.word();

      test('it returns it', () => {
        const channel = new TwitchChannel(randomName, mockTwitchClientInstance);
        expect(channel.name()).toEqual(randomName);
      });
    });
  });
  describe('when converting the object to a string', () => {
    test('it prints out the channel name', () => {
      const randomName = chance.word();

      const channel = new TwitchChannel(randomName, mockTwitchClientInstance);
      expect(`${channel}`).toEqual('#' + randomName);
    });
  });
  describe('when responding to a channel', () => {
    test('it calls the right things', () => {
      const randomName = chance.word();
      const randomMessage = chance.sentence();
      const channel = new TwitchChannel(randomName, mockTwitchClientInstance);

      channel.say(randomMessage);

      expect(mockSay).toHaveBeenCalledWith('#' + randomName, randomMessage);

    });
  });
});
