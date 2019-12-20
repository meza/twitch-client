import { IRCMessageTags } from '../IRC/types';

export default class TwitchUser {
  private readonly username: string;
  private readonly isSub: boolean = false;
  private readonly isMod: boolean = false;

  public constructor(
    name: string,
    isSub = false,
    isMod = false
  ) {
    this.username = name;
    this.isSub = isSub;
    this.isMod = isMod;
  }

  public static from(tags: IRCMessageTags) {
    let isMod = (tags.mod === '1');
    let isSub = (tags.subscriber === '1');

    if (tags.badges) {
      if (tags.badges.indexOf('broadcaster/1') > -1) {
        isMod = true;
        isSub = true;
      }
    }

    return new TwitchUser(tags['display-name'], isSub, isMod);
  }

  public name() {
    return this.username;
  }

  public mod() {
    return this.isMod;
  }

  public subscriber() {
    return this.isSub;
  }
}
