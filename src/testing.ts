import dotenv from 'dotenv-defaults';
import TwitchClient from './Client/TwitchClient';
dotenv.config();

const client = new TwitchClient(
  process.env.TWITCH_USERNAME || '',
  process.env.TWITCH_ACCESS_TOKEN || '',
  {
    onConnected: (tc) => {
      tc.connectToChat('vsbmeza3');
    }
  }
);

client.onCommand('boo', (channel, user) => {
  channel.say('WAT GEEZ @' + user.name());
});

process.on('SIGINT', function () {
  console.log('Caught interrupt signal');
  // eslint-disable-next-line no-process-exit
  process.exit();
});

setInterval(() => {
  console.log('.');
}, 30000);
