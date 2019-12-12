import { handler, privMsgHandler } from './privMsg.handler';
import { IRCMessage } from '../../IRC/types';
import { randomPrefix } from '../../../test/prefix.generator';
import { generateUser } from '../../../test/twitchUser.generator';
import TwitchChannel from '../TwitchChannel';
import { chance } from 'jest-chance';
import TwitchClient from '../TwitchClient';

let eventProcessorInstance;
let ircClientInstance;
const mockEmit = jest.fn();
const mockOn = jest.fn();

const twitchClientInstance = {} as unknown as TwitchClient;

describe('The PRIVMSG handler', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    eventProcessorInstance = {
      emit: mockEmit
    };
    ircClientInstance = {
      on: mockOn
    };
  });
  describe('when setting it up', () => {
    test('it listens to the correct event', () => {
      privMsgHandler(twitchClientInstance, ircClientInstance, eventProcessorInstance, {});

      expect(mockOn).toHaveBeenCalledWith('privmsg', expect.any(Function));
    });

    test('it calls through to the handler', () => {
      const user = generateUser();
      const randomChannelName = chance.word();
      const randomChannel = new TwitchChannel(randomChannelName, twitchClientInstance);
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: user.generated,
        params: [
          randomChannelName,
          ':!boo',
          'hello',
          'world'
        ]
      };
      privMsgHandler(twitchClientInstance, ircClientInstance, eventProcessorInstance, {});

      const actualHandler = mockOn.mock.calls[0][1];

      actualHandler(message);

      expect(mockEmit).toHaveBeenCalledWith(
        'command',
        'boo',
        randomChannel,
        user.expected,
        [
          'hello',
          'world'
        ]
      );
    });
  });
  describe('when the message has a : in the front', () => {
    test('it ignores the :', () => {
      const user = generateUser();
      const randomChannelName = chance.word();
      const randomChannel = new TwitchChannel(randomChannelName, twitchClientInstance);
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: user.generated,
        params: [
          randomChannelName,
          ':hello',
          'world'
        ]
      };

      handler(message, twitchClientInstance, eventProcessorInstance, {});

      expect(mockEmit).toHaveBeenCalledWith('message', randomChannel, user.expected, 'hello world');

    });
  });
  describe('when the message does not have a : in the front', () => {
    test('it still works', () => {
      const user = generateUser();
      const randomChannelName = chance.word();
      const randomChannel = new TwitchChannel(randomChannelName, twitchClientInstance);
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: user.generated,
        params: [
          randomChannelName,
          'hello',
          'world'
        ]
      };

      handler(message, twitchClientInstance, eventProcessorInstance, {});

      expect(mockEmit).toHaveBeenCalledWith('message', randomChannel, user.expected, 'hello world');

    });
  });
  describe('when the message does not have a user associated', () => {
    test('it still works', () => {
      const randomChannelName = chance.word();
      const randomChannel = new TwitchChannel(randomChannelName, twitchClientInstance);
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: {},
        params: [
          randomChannelName,
          'hello',
          'world'
        ]
      };

      handler(message, twitchClientInstance, eventProcessorInstance, {});

      expect(mockEmit).toHaveBeenCalledWith('message', randomChannel, null, 'hello world');

    });
  });
  describe('when encountering a command', () => {
    test('it fires the command event', () => {
      const user = generateUser();
      const randomChannelName = chance.word();
      const randomChannel = new TwitchChannel(randomChannelName, twitchClientInstance);
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: user.generated,
        params: [
          randomChannelName,
          ':!boo',
          'hello',
          'world'
        ]
      };

      handler(message, twitchClientInstance, eventProcessorInstance, {});

      expect(mockEmit).toHaveBeenCalledWith('command', 'boo', randomChannel, user.expected, [
        'hello',
        'world'
      ]);
    });
  });
});
