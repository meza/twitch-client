import { chance } from 'jest-chance';
import IRCClient from '../IRC/IRCClient';
import TwitchClient from './TwitchClient';
import TwitchEventProcessor from './TwitchEventProcessor';

jest.mock('../IRC/IRCClient');
jest.mock('./TwitchEventProcessor');

const mockIRCClient = IRCClient as jest.Mocked<any>;
const mockTwitchEventProcessor = TwitchEventProcessor as jest.Mocked<any>;
const randomUser = chance.word();
const randomToken = chance.hash();

const mockOn = jest.fn();
const mockEmit = jest.fn();
const mockTwitchEventProcessorInstance = {
  on: mockOn,
  emit: mockEmit
};

const mockOnIRC = jest.fn();
const mockIRCClientInstance = {
  on: mockOnIRC
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
});
