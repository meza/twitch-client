import { IRCMessage, IRCMessagePartType, IRCMessagePrefix, IRCMessageTags } from './types';

const getPartType = (part: string): IRCMessagePartType => {
  const indicator = part[0];
  switch (indicator) {
    case '@':
      return IRCMessagePartType.Tags;
    case ':':
      return IRCMessagePartType.Prefix;
    default:
      return IRCMessagePartType.Command;
  }
};
const parseTags = (data: string): IRCMessageTags => {
  const tags = {};
  const rawTags = data.split(';');
  rawTags.forEach((tag) => {
    const [tagName, tagValue] = tag.split('=');
    tags[tagName] = tagValue;
  });

  return tags;
};
const parsePrefix = (data: string): IRCMessagePrefix => {
  if (data.indexOf('@') === -1) {
    return {
      nick: '',
      user: '',
      host: data
    };
  }

  const [nick, url] = data.split('!');
  const [user, host] = url.split('@');
  return {
    nick: nick,
    user: user,
    host: host
  };

};

export const parse = (data: string): IRCMessage => {
  let tags = {};
  let prefix: IRCMessagePrefix = {
    host: '',
    user: '',
    nick: ''
  };
  const deets: string[] = [];

  const messageParts = data.split(' ');

  let prefixFound = false;

  messageParts.forEach((part: string) => {
    const type = getPartType(part);

    switch (type) {
      case IRCMessagePartType.Tags: {
        if (Object.keys(tags).length === 0) {
          tags = parseTags(part.slice(1));
          break;
        }
        deets.push(part);
        break;
      }
      case IRCMessagePartType.Prefix: {
        if (!prefixFound) {
          prefix = parsePrefix(part.slice(1));
          prefixFound = true;
          break;
        }
        deets.push(part);
        break;
      }
      default: {
        deets.push(part);
      }
    }
  });

  return {
    raw: data,
    tags: tags,
    command: deets[0] || '',
    params: deets.slice(1),
    prefix: prefix
  };
};
