import WebSocket from 'isomorphic-ws';
import IRCMessageProcessor from './IRCMessageProcessor';
import { IRCMessage } from './types';
import { parse } from './TagParser';

export default class IRCClient {
  private readonly username: string;
  private readonly token: string;
  private readonly ws: WebSocket;
  private processor: IRCMessageProcessor;

  public constructor(username: string, token: string) {
    this.username = username;
    this.token = token;
    this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);

    this.processor = new IRCMessageProcessor(this.ws);

    this.processor.on('ping', (e, ws) => {
      ws.send(`PONG :${e.prefix.host}\r\n`);
    });
  }

  public send(rawMessage: string) {
    const msg = rawMessage.trim() + '\r\n';
    console.log(`ABOUT TO SEND: ${msg}`);
    this.ws.send(msg);
  }

  public on(event: string, callback: (message: IRCMessage, ws: WebSocket) => void) {
    this.processor.on(event.toLowerCase(), callback);
  }

  private onOpen(): void {
    console.log('connected');
    this.ws.send(`PASS oauth:${this.token}`);
    this.ws.send(`NICK ${this.username}`);
    this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
    this.processor.emit('connected');
  }
  private onClose(event: WebSocket.CloseEvent) {
    console.log('disconnected', event.reason, event.code);
  }
  private onMessage(event: WebSocket.MessageEvent) {
    // console.log(event.data);
    const dataLines = event.data.toString().split('\r\n');
    dataLines.forEach((line: string) => {
      if (!line) {
        return;
      }
      const message: IRCMessage = parse(line);
      // console.log({ message: message });
      this.processor.process(message);
    });
  }

  private onError(e: WebSocket.ErrorEvent) {
    console.log('ERROR', e.message);
  }
}
