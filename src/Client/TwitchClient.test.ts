import { chance } from 'jest-chance';
import IRCClient from '../IRC/IRCClient';
import TwitchClient from './TwitchClient';
import TwitchEventProcessor from './TwitchEventProcessor';
import TwitchChannel from './TwitchChannel';
// import { IRCMessage } from '../IRC/types';

jest.mock('../IRC/IRCClient');
jest.mock('./TwitchEventProcessor');
jest.mock('./TwitchChannel');

const mockIRCClient = IRCClient as jest.Mocked<any>;
const mockTwitchEventProcessor = TwitchEventProcessor as jest.Mocked<any>;
const mockTwitchChannel = TwitchChannel as jest.Mocked<any>;

const randomUser = chance.word();
const randomToken = chance.hash();

const mockOn = jest.fn();
const mockIRCSend = jest.fn();
const mockEmit = jest.fn();
const mockTwitchEventProcessorInstance = {
  on: mockOn,
  emit: mockEmit
};

const mockOnIRC = jest.fn();
const mockIRCClientInstance = {
  on: mockOnIRC,
  send: mockIRCSend
};
describe('The Twitch Client', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockTwitchEventProcessor.mockImplementation(() => {
      return mockTwitchEventProcessorInstance;
    });

    mockIRCClient.mockImplementation(() => {
      return mockIRCClientInstance;
    });

    mockTwitchChannel.mockImplementation((name) => {
      return {
        toString: () => name
      };
    });
  });

  describe('when initialized', () => {
    test('it sets up the IRC Client appropriately', () => {
      // eslint-disable-next-line no-new
      new TwitchClient(randomUser, randomToken);

      expect(mockIRCClient).toHaveBeenCalledWith(randomUser, randomToken);
    });
    test('it threads the connected event properly', () => {
      const onConnected = jest.fn();
      const actualClient = new TwitchClient(randomUser, randomToken, {
        onConnected: onConnected
      });

      expect(mockOn).toHaveBeenCalledWith('connected', expect.any(Function));

      const connectedCallback = mockOn.mock.calls[0][1];
      connectedCallback();
      expect(onConnected).toHaveBeenCalledWith(actualClient);

      expect(mockOnIRC).toHaveBeenCalledWith('connected', expect.any(Function));
      const ircConnectedCallback = mockOnIRC.mock.calls[0][1];
      ircConnectedCallback();
      expect(mockEmit).toHaveBeenCalledWith('connected');

    });
    test('it ignores the onConnected if not supplied in the options', () => {
      // eslint-disable-next-line no-new
      new TwitchClient(randomUser, randomToken);

      expect(mockOn).toHaveBeenCalledWith('connected', expect.any(Function));

      const connectedCallback = mockOn.mock.calls[0][1];
      connectedCallback();

      expect(mockOnIRC).toHaveBeenCalledWith('connected', expect.any(Function));
      const ircConnectedCallback = mockOnIRC.mock.calls[0][1];
      ircConnectedCallback();
      expect(mockEmit).toHaveBeenCalledWith('connected');
    });
  });
  describe('when joining a channel\'s chat', () => {
    test('it issues the right commands', () => {
      const randomChannelName = chance.word();
      const randomTransformedName = chance.word();
      mockTwitchChannel.mockImplementation(() => {
        return {
          toString: () => randomTransformedName
        };
      });

      const twitchClient = new TwitchClient(randomUser, randomToken);

      twitchClient.connectToChat(randomChannelName);
      expect(mockTwitchChannel).toHaveBeenCalledWith(randomChannelName, twitchClient);
      expect(mockIRCSend).toHaveBeenCalledWith('JOIN ' + randomTransformedName);
    });
  });
  describe('when sending a public message to a channel', () => {
    describe('when passing in a string as the channel name', () => {
      test('it forwards the correct arguments to the IRC Client', () => {
        const randomChannelName = chance.word();
        const randomMessage = chance.sentence();
        const twitchClient = new TwitchClient(randomUser, randomToken);

        twitchClient.say(randomChannelName, randomMessage);

        expect(mockIRCSend).toHaveBeenCalledWith('PRIVMSG ' + randomChannelName + ' :' + randomMessage);
      });
    });

    describe('when passing in a channel object as the channel name', () => {
      test('it forwards the correct arguments to the IRC Client', () => {
        const randomChannelName = chance.word();
        const randomMessage = chance.sentence();
        const twitchClient = new TwitchClient(randomUser, randomToken);

        twitchClient.say(new TwitchChannel(randomChannelName, twitchClient), randomMessage);

        expect(mockIRCSend).toHaveBeenCalledWith('PRIVMSG ' + randomChannelName + ' :' + randomMessage);
      });
    });

    describe('when encountering a command', () => {
      test('it passes it through to the correct handler', (done) => {
        const twitchClient = new TwitchClient(randomUser, randomToken);
        twitchClient.onCommand('boo', done);

        expect(mockOn).toHaveBeenCalledWith('command', expect.any(Function));
        expect(mockOn.mock.calls[1][0]).toEqual('command');

        const actualHandler = mockOn.mock.calls[1][1];
        actualHandler('boo');
      });

      describe('and we are not listening to such command', () => {
        test('it does nothing', () => {
          const twitchClient = new TwitchClient(randomUser, randomToken);
          twitchClient.onCommand('dummy', () => {
            expect('This should not have been called').toEqual('');
          });

          expect(mockOn).toHaveBeenCalledWith('command', expect.any(Function));
          expect(mockOn.mock.calls[1][0]).toEqual('command');

          const actualHandler = mockOn.mock.calls[1][1];
          actualHandler('boo');
        });
      });
    });
  });
});
