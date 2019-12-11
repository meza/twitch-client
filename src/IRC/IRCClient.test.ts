import IRCClient from './IRCClient';
import { chance } from 'jest-chance';
import WebSocket from 'isomorphic-ws';
import IRCMessageProcessor from './IRCMessageProcessor';
import { IRCMessage } from './types';
import { parse } from './TagParser';

jest.mock('isomorphic-ws');
jest.mock('./IRCMessageProcessor');
jest.mock('./TagParser');

const mockWs = WebSocket as jest.Mocked<any>;
const mockIRCMessageProcessor = IRCMessageProcessor as jest.Mocked<any>;
const mockParse = parse as jest.Mocked<any>;
const mockWsSend = jest.fn();
const mockOn = jest.fn();
const mockProcess = jest.fn();
const mockEmit = jest.fn();
let mockWsInstance;
let mockProcessorInstance;

describe('The IRC Client', () => {
  const randomUsername = chance.word();
  const randomToken = chance.hash();

  beforeEach(() => {
    jest.resetAllMocks();
    mockWsInstance = {
      send: mockWsSend
    };

    mockProcessorInstance = {
      on: mockOn,
      process: mockProcess,
      emit: mockEmit
    };

    mockWs.mockImplementation(() => {
      return mockWsInstance;
    });

    mockIRCMessageProcessor.mockImplementation(() => {
      return mockProcessorInstance;
    });

    // eslint-disable-next-line no-new
    new IRCClient(randomUsername, randomToken);
  });

  describe('when creating the client', () => {
    test('it connects to the correct server', () => {
      expect(mockWs).toHaveBeenCalledWith('wss://irc-ws.chat.twitch.tv:443');
    });

    test('it sets up the message processor correctly', () => {
      expect(mockIRCMessageProcessor).toHaveBeenCalledWith(mockWsInstance);
    });

    test('it sets up the ping responder', () => {
      expect(mockOn).toHaveBeenCalledWith('ping', expect.any(Function));

      const pongCallback = mockOn.mock.calls[0][1];

      const pingMessage: IRCMessage = {
        command: 'PING',
        params: [],
        tags: {},
        raw: 'PING :test.test.com',
        prefix: {
          nick: '',
          user: '',
          host: 'test.test.com'
        }
      };

      pongCallback(pingMessage, mockWsInstance);

      expect(mockWsSend).toHaveBeenCalledWith('PONG :test.test.com\r\n');

    });

    test('it sets up the on open ws listener', () => {
      expect(mockWsInstance).toHaveProperty('onopen');

      mockWsInstance.onopen(null);

      expect(mockWsSend).toHaveBeenNthCalledWith(1, 'PASS oauth:' + randomToken);
      expect(mockWsSend).toHaveBeenNthCalledWith(2, 'NICK ' + randomUsername);
      expect(mockWsSend).toHaveBeenNthCalledWith(3, 'CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
      expect(mockEmit).toHaveBeenCalledWith('connected');
    });

    test('it sets up th on close', () => {
      expect(mockWsInstance).toHaveProperty('onclose');
      mockWsInstance.onclose({
        reason: chance.word(),
        code: chance.natural(),
        target: undefined,
        wasClean: true
      });
    });

    test('it sets up th on error', () => {
      expect(mockWsInstance).toHaveProperty('onerror');
      mockWsInstance.onerror({
        message: chance.word(),
        error: undefined,
        target: undefined,
        type: 'test'
      });
    });

    test('it sets up th on message', () => {
      expect(mockWsInstance).toHaveProperty('onmessage');
    });

    describe('when parsing messages', () => {
      test('it deals with all the lines', () => {
        const expectedLines = [
          'aaa',
          'bbb',
          '',
          'ccc'
        ];
        const rawLines = expectedLines.join('\r\n');
        const firstReply = chance.hash();
        const secondReply = chance.hash();
        const thirdReply = chance.hash();

        mockParse.mockReturnValueOnce(firstReply);
        mockParse.mockReturnValueOnce(secondReply);
        mockParse.mockReturnValueOnce(thirdReply);

        mockWsInstance.onmessage({
          type: '',
          data: rawLines,
          target: mockWsInstance
        });

        expect(mockParse).toHaveBeenNthCalledWith(1, 'aaa');
        expect(mockParse).toHaveBeenNthCalledWith(2, 'bbb');
        expect(mockParse).toHaveBeenNthCalledWith(3, 'ccc');

        expect(mockProcess).toHaveBeenNthCalledWith(1, firstReply);
        expect(mockProcess).toHaveBeenNthCalledWith(2, secondReply);
        expect(mockProcess).toHaveBeenNthCalledWith(3, thirdReply);
      });
    });
  });
  describe('when registering listeners', () => {
    test('it adds the listeners to the internal processor', () => {
      const client = new IRCClient(randomUsername, randomToken);
      const callback = jest.fn();

      client.on('hello', callback);

      expect(mockOn).toHaveBeenCalledWith('hello', callback);
    });
  });
  describe('when sending messages', () => {
    test('it adds the trailing line breaks', () => {
      const ircClient = new IRCClient(randomUsername, randomToken);
      const randomMessage = chance.sentence();

      ircClient.send(randomMessage);

      expect(mockWsInstance.send).toHaveBeenCalledWith(randomMessage + '\r\n');

    });
  });
});
