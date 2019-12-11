import { handler, privMsgHandler } from './privMsg.handler';
import { IRCMessage } from '../../IRC/types';
import { randomPrefix } from '../../../test/prefix.generator';

let eventProcessorInstance;
let ircClientInstance;
const mockEmit = jest.fn();
const mockOn = jest.fn();

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
      privMsgHandler(ircClientInstance, eventProcessorInstance, {});

      expect(mockOn).toHaveBeenCalledWith('privmsg', expect.any(Function));
    });

    test('it calls through to the handler', () => {
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: {},
        params: [
          ':!boo',
          'hello',
          'world'
        ]
      };
      privMsgHandler(ircClientInstance, eventProcessorInstance, {});

      const actualHandler = mockOn.mock.calls[0][1];

      actualHandler(message);

      expect(mockEmit).toHaveBeenCalledWith('command', 'boo', {
        prefix: message.prefix,
        tags: message.tags,
        params: [
          'hello',
          'world'
        ]
      });
    });
  });
  describe('when the message has a : in the front', () => {
    test('it ignores the :', () => {
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: {},
        params: [
          ':hello',
          'world'
        ]
      };

      handler(message, eventProcessorInstance, {});

      expect(mockEmit).toHaveBeenCalledWith('message', 'hello world');

    });
  });
  describe('when the message does not have a : in the front', () => {
    test('it still works', () => {
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: {},
        params: [
          'hello',
          'world'
        ]
      };

      handler(message, eventProcessorInstance, {});

      expect(mockEmit).toHaveBeenCalledWith('message', 'hello world');

    });
  });
  describe('when encoutering a command', () => {
    test('it fires the command event', () => {
      const message: IRCMessage = {
        command: 'PRIVMSG',
        prefix: randomPrefix(),
        raw: '',
        tags: {},
        params: [
          ':!boo',
          'hello',
          'world'
        ]
      };

      handler(message, eventProcessorInstance, {});

      expect(mockEmit).toHaveBeenCalledWith('command', 'boo', {
        prefix: message.prefix,
        tags: message.tags,
        params: [
          'hello',
          'world'
        ]
      });

    });
  });
});
