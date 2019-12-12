import IRCClient from '../IRC/IRCClient';
import { TwitchClientOptions } from './types';
import TwitchEventProcessor from './TwitchEventProcessor';
import TwitchChannel from './TwitchChannel';
import { setUpHandlers } from './IRCHandlers';
import TwitchUser from './TwitchUser';

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
    setUpHandlers(this, this.ircClient, this.eventProcessor, this.options);
  }
  public onCommand(commandName: string, callback: (
    channel: TwitchChannel,
    user: TwitchUser,
    messageParts: string[]
  ) => void) {
    this.eventProcessor.on('command', (
      incomingCommand: string,
      channel: TwitchChannel,
      user: TwitchUser,
      messageParts: string[]
    ) => {
      if (commandName.toLowerCase() === incomingCommand.toLowerCase()) {
        callback(channel, user, messageParts);
      }
    });
  }

  public connectToChat(channelName: string) {
    const channel = new TwitchChannel(channelName, this);

    this.ircClient.send(`JOIN ${channel}`);
  }

  public say(channelName: string | TwitchChannel, message: string) {
    let channel = channelName;

    if (typeof channelName === 'string') {
      channel = new TwitchChannel(channelName, this);
    }

    this.ircClient.send(`PRIVMSG ${channel} :${message}`);
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
