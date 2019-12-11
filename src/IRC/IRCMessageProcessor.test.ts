import WebSocket from 'isomorphic-ws';
import IRCMessageProcessor from './IRCMessageProcessor';
import { IRCMessage } from './types';
import { chance } from 'jest-chance';

jest.mock('isomorphic-ws');

const mockWs = WebSocket as jest.Mocked<any>;

describe('The IRC Message Processor', () => {
  describe('when processing an event', () => {
    test('it emits the correct things', (done) => {
      const mp = new IRCMessageProcessor(mockWs);
      const randomCommand = chance.word();
      const message = {
        raw: chance.sentence(),
        prefix: {
          host: chance.url(),
          user: chance.word(),
          nick: chance.word()
        },
        tags: {
          random: chance.word()
        },
        command: randomCommand.toUpperCase(),
        params: chance.n(chance.word, chance.natural({ min: 0, max: 10 }))
      };

      mp.on(randomCommand.toLowerCase(), (e: IRCMessage, ws: WebSocket) => {
        expect(e).toBe(message);
        expect(ws).toBe(mockWs);
        done();
      });

      mp.process(message);

    });
  });
});
