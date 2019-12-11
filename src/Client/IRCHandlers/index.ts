import IRCClient from '../../IRC/IRCClient';
import { privMsgHandler } from './privMsg.handler';
import TwitchEventProcessor from '../TwitchEventProcessor';
import { TwitchClientOptions } from '../types';

export const setUpHandlers = (
  ircClient: IRCClient,
  eventProcessor: TwitchEventProcessor,
  config: TwitchClientOptions
) => {
  privMsgHandler(ircClient, eventProcessor, config);
};
