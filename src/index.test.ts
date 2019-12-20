import TwitchClient from './Client/TwitchClient';
import TwitchUser from './Client/TwitchUser';
import TwitchChannel from './Client/TwitchChannel';
jest.mock('./Client/TwitchClient');
jest.mock('./Client/TwitchUser');
jest.mock('./Client/TwitchChannel');

describe('The library entry point', () => {
  test('it exposes the Twitch Client', async () => {
    const exposedThings = await import('./index');
    expect(exposedThings.default).toBe(TwitchClient);
  });

  test('it exposes the Twitch User', async () => {
    const exposedThings = await import('./index');
    expect(exposedThings.TwitchUser).toBe(TwitchUser);
  });

  test('it exposes the Twitch Channel', async () => {
    const exposedThings = await import('./index');
    expect(exposedThings.TwitchChannel).toBe(TwitchChannel);
  });
});
