import { EventEmitter } from 'events';
import { IRCMessage } from './types';
import WebSocket from 'isomorphic-ws';

export default class IRCMessageProcessor extends EventEmitter {
  private readonly ws: WebSocket;
  public constructor(ws: WebSocket) {
    super();
    this.ws = ws;
  }

  public process(message: IRCMessage) {
    console.log(`emitting: ${message.command.toLowerCase().trim()}`);
    console.log(message.raw);
    this.emit(message.command.toLowerCase().trim(), message, this.ws);
  }
}
