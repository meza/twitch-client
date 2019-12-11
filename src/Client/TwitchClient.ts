import IRCClient from '../IRC/IRCClient';
import { TwitchClientOptions } from './types';
import TwitchEventProcessor from './TwitchEventProcessor';

export default class TwitchClient {
  private readonly user: string;
  private readonly token: string;
  private readonly options: TwitchClientOptions;
  private readonly ircClient: IRCClient;
  private readonly eventProcessor: TwitchEventProcessor;

  public constructor(user: string, token: string, options: TwitchClientOptions = {}) {
    this.user = user;
    this.token = token;
    this.options = options;
    this.ircClient = new IRCClient(this.user, this.token);
    this.eventProcessor = new TwitchEventProcessor();

    this.eventProcessor.on('connected', this.onConnected.bind(this));
    this.ircClient.on('connected', this.onIRCConnected.bind(this));
  }

  private onIRCConnected() {
    this.eventProcessor.emit('connected');
  }

  private onConnected() {
    if (this.options.onConnected) {
      this.options.onConnected(this);
    }
  }
}
