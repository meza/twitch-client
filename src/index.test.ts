import IRCClient from './IRC/IRCClient';
jest.mock('./IRC/IRCClient');

describe('The library entry point', () => {
  test('it exposes the IRC Client', async () => {
    const exposedThings = await import('./index');
    expect(exposedThings.default.IRCClient).toBe(IRCClient);
  });
});
