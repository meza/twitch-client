export interface IRCMessageTags {
  [key: string]: string;
}

export interface IRCMessagePrefix {
  nick: string;
  user: string;
  host: string;
}

export interface IRCMessage {
  raw: string;
  tags: IRCMessageTags;
  prefix: IRCMessagePrefix;
  command: string;
  params: string[];
}

export enum IRCMessagePartType {
  Prefix = 'prefix',
  Tags = 'tags',
  Command = 'command'
}
