import IRCClient from '../../IRC/IRCClient';
import { privMsgHandler } from './privMsg.handler';
import TwitchEventProcessor from '../TwitchEventProcessor';
import { TwitchClientOptions } from '../types';
import TwitchClient from '../TwitchClient';

export const setUpHandlers = (
  twitchClient: TwitchClient,
  ircClient: IRCClient,
  eventProcessor: TwitchEventProcessor,
  config: TwitchClientOptions
) => {
  privMsgHandler(twitchClient, ircClient, eventProcessor, config);
};
