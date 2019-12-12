import { setUpHandlers } from './index';
import { privMsgHandler } from './privMsg.handler';
import IRCClient from '../../IRC/IRCClient';
import TwitchEventProcessor from '../TwitchEventProcessor';
import { TwitchClientOptions } from '../types';
import TwitchClient from '../TwitchClient';

jest.mock('./privMsg.handler');

const mockPrivMsgHandler = privMsgHandler as jest.Mock<any>;

describe('The handler root', () => {
  test('it sets things up proprely', () => {
    const ircClient = jest.fn();
    const twitchClient = jest.fn();
    const eventProcessor = jest.fn();
    const config = jest.fn();

    setUpHandlers(
      twitchClient as unknown as TwitchClient,
      ircClient as unknown as IRCClient,
      eventProcessor as unknown as TwitchEventProcessor,
      config as TwitchClientOptions
    );

    expect(mockPrivMsgHandler).toHaveBeenCalledWith(twitchClient, ircClient, eventProcessor, config);

  });
});
