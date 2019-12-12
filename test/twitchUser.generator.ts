import { chance } from 'jest-chance';
import TwitchUser from '../src/Client/TwitchUser';

export interface GeneratedUserResult {
  generated: {
    'display-name': string;
    mod: string;
    subscriber: string;
  };
  expected: TwitchUser;
}

export const generateUser = (): GeneratedUserResult => {
  const username = chance.word();
  const isMod = chance.bool();
  const isSub = chance.bool();
  return {
    generated: {
      'display-name': username,
      mod: isMod ? '1' : '0',
      subscriber: isSub ? '1' : '0'
    },
    expected: new TwitchUser(username, isSub, isMod)
  };
};
