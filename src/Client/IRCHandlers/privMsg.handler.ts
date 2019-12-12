import IRCClient from '../../IRC/IRCClient';
import TwitchEventProcessor from '../TwitchEventProcessor';
import { TwitchClientOptions } from '../types';
import { IRCMessage } from '../../IRC/types';
import TwitchUser from '../TwitchUser';
import TwitchClient from '../TwitchClient';
import TwitchChannel from '../TwitchChannel';

export const handler = (
  message: IRCMessage,
  twitchClient: TwitchClient,
  eventProcessor: TwitchEventProcessor,
  config: TwitchClientOptions
) => {
  let user: TwitchUser | null = null;

  const channel = new TwitchChannel(message.params[0], twitchClient);
  const messageParts = message.params.splice(1);
  if (messageParts[0][0] === ':') {
    messageParts[0] = messageParts[0].slice(1);
  }

  if (message.tags['display-name']) {
    user = TwitchUser.from(message.tags);
  }

  if (messageParts[0][0] === (config.commandPrefix || '!')) {
    messageParts[0] = messageParts[0].slice(1);
    eventProcessor.emit('command', messageParts.shift(), channel, user, messageParts);
    return;
  }

  eventProcessor.emit('message', channel, user, messageParts.join(' '));
};

export const privMsgHandler = (
  twitchClient: TwitchClient,
  ircClient: IRCClient,
  eventProcessor: TwitchEventProcessor,
  config: TwitchClientOptions
) => {
  ircClient.on('privmsg', (message) => {
    handler(message, twitchClient, eventProcessor, config);
  });
};
