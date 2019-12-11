import TwitchClient from './TwitchClient';

export interface TwitchClientOptions {
  commandPrefix?: string;
  onConnected?: (client: TwitchClient) => void;
}
