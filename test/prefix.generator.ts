import { chance } from 'jest-chance';

export const randomPrefix = () => ({
  host: chance.url(),
  user: chance.word(),
  nick: chance.word()
});
