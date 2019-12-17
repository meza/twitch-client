import TwitchClient from './Client/TwitchClient';
jest.mock('./Client/TwitchClient');

describe('The library entry point', () => {
  test('it exposes the IRC Client', async () => {
    const exposedThings = await import('./index');
    expect(exposedThings.default).toBe(TwitchClient);
  });
});
