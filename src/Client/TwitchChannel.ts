import TwitchClient from './TwitchClient';

export default class TwitchChannel {
  private readonly channelName: string;
  private readonly twitchClient: TwitchClient;

  public constructor(name: string, twitchClient: TwitchClient) {
    this.twitchClient = twitchClient;
    let channel = name;

    if (channel[0] === '#') {
      channel = channel.slice(1);
    }
    this.channelName = `#${channel}`;
  }

  public name(): string {
    return this.channelName;
  }

  public say(message: string) {
    this.twitchClient.say(this.name(), message);
  }

  public toString() {
    return this.name();
  }
}
