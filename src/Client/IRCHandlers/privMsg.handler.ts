import IRCClient from '../../IRC/IRCClient';
import TwitchEventProcessor from '../TwitchEventProcessor';
import { TwitchClientOptions } from '../types';
import { IRCMessage } from '../../IRC/types';

export const handler = (
  message: IRCMessage,
  eventProcessor: TwitchEventProcessor,
  config: TwitchClientOptions
) => {
  const messageParts = message.params;
  if (messageParts[0][0] === ':') {
    messageParts[0] = messageParts[0].slice(1);
  }

  if (messageParts[0][0] === (config.commandPrefix || '!')) {
    messageParts[0] = messageParts[0].slice(1);
    eventProcessor.emit('command', messageParts.shift(), {
      tags: message.tags,
      prefix: message.prefix,
      params: messageParts
    });
    return;
  }

  eventProcessor.emit('message', messageParts.join(' '));
};

export const privMsgHandler = (
  ircClient: IRCClient,
  eventProcessor: TwitchEventProcessor,
  config: TwitchClientOptions
) => {
  ircClient.on('privmsg', (message) => {
    handler(message, eventProcessor, config);
  });
};
