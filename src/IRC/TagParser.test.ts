import { parse } from './TagParser';

describe('The Tag Parser', () => {
  describe('when parsing the tags', () => {
    describe('and tags exist', () => {
      const data = '@emote-only=0;followers-only=-1;r9k=0;rituals=0;room-id=72930026;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #vsbmeza3';

      test('tags are parsed', () => {
        const x = parse(data);
        expect(x.tags).toEqual({
          'emote-only': '0',
          'followers-only': '-1',
          r9k: '0',
          rituals: '0',
          'room-id': '72930026',
          slow: '0',
          'subs-only': '0'
        });
      });
    });
    describe('and there are other @ symbols in the params', () => {
      const data = '@emote-only=0;followers-only=-1;r9k=0;rituals=0;room-id=72930026;slow=0;subs-only=0 :tmi.twitch.tv command @vsbmeza3';
      test('tags are still parsed correctly', () => {
        const x = parse(data);
        expect(x.tags).toEqual({
          'emote-only': '0',
          'followers-only': '-1',
          r9k: '0',
          rituals: '0',
          'room-id': '72930026',
          slow: '0',
          'subs-only': '0'
        });
      });
    });
    describe('and tags do not exist', () => {
      const data = ':vsbmeza3.tmi.twitch.tv 366 vsbmeza3 vsbmeza3 :End of /NAMES list';
      test('tags are parsed empty', () => {
        const x = parse(data);
        expect(x.tags).toEqual({});
      });
    });
  });
  describe('when parsing the prefix', () => {
    describe('and there is a full prefix', () => {
      const data = ':olive!olive_cat@olive_cat.tmi.twitch.tv JOIN #vsbmeza3';
      test('it parses the prefix', () => {
        const actual = parse(data);
        expect(actual.prefix).toEqual({
          host: 'olive_cat.tmi.twitch.tv',
          nick: 'olive',
          user: 'olive_cat'
        });
      });
    });
    describe('and there is a partial prefix', () => {
      const data = ':vsbmeza3.tmi.twitch.tv JOIN #vsbmeza3';
      test('it parses the prefix', () => {
        const actual = parse(data);
        expect(actual.prefix).toEqual({
          host: 'vsbmeza3.tmi.twitch.tv',
          nick: '',
          user: ''
        });
      });
    });
    describe('and there is no prefix', () => {
      const data = 'PING';
      test('it returns an empty prefix object', () => {
        const actual = parse(data);
        expect(actual.prefix).toEqual({
          nick: '',
          user: '',
          host: ''
        });
      });
    });
  });
  describe('when parsing the command and params', () => {
    describe('and there is no command', () => {
      const data = ':vsbmeza3.tmi.twitch.tv';
      test('it sets the command to empty', () =>{
        const actual = parse(data);
        expect(actual.command).toEqual('');
      });
    });
    describe('and there is a command', () => {
      describe('and there are no params', () => {
        const data = ':vsbmeza3.tmi.twitch.tv 366';
        test('it parses the command', () => {
          const actual = parse(data);
          expect(actual.command).toEqual('366');
        });
      });
      describe('and there are actual params', () => {
        const data = ':vsbmeza3.tmi.twitch.tv 366 param1 param2';
        test('it parses the command and params', () => {
          const actual = parse(data);
          expect(actual.command).toEqual('366');
          expect(actual.params).toEqual([
            'param1',
            'param2'
          ]);
        });
      });
    });
  });
});
