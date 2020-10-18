const commandLineParser = require('../src/index');

describe('commandLineParser', () => {
  it('should not choke on empty input', () => {
    expect(commandLineParser([])).toEqual({ $: [] });
  });

  describe('flags', () => {
    it('should parse double-dash options as booleans', () => {
      expect(commandLineParser(['--a'])).toEqual({ a: true, $: [] });
      expect(commandLineParser(['--abc-def'])).toEqual({ abcDef: true, $: [] });
      expect(commandLineParser(['--abc_def'])).toEqual({ abcDef: true, $: [] });
      expect(commandLineParser(['--abcDef'])).toEqual({ abcDef: true, $: [] });
    });
  });

  describe('values', () => {
    it('should parse options with equal sign as strings', () => {
      expect(commandLineParser(['--a=ok'])).toEqual({ a: 'ok', $: [] });
    });

    it('should treat additional equal signs literally', () => {
      expect(commandLineParser(['--a=ok='])).toEqual({ a: 'ok=', $: [] });
      expect(commandLineParser(['--a==ok'])).toEqual({ a: '=ok', $: [] });
    });

    it('should not strip whitespace', () => {
      expect(commandLineParser(['--a= ok boomer '])).toEqual({ a: ' ok boomer ', $: [] });
    });

    it('should not choke on empty value', () => {
      expect(commandLineParser(['--a='])).toEqual({ a: '', $: [] });
    });
  });

  describe('nested values', () => {
    it('should go deeper on dots', () => {
      expect(commandLineParser(['--a.b'])).toEqual({ a: { b: true }, $: [] });
      expect(commandLineParser(['--a.b=ok'])).toEqual({ a: { b: 'ok' }, $: [] });
    });
  });

  describe('stopper', () => {
    it('should not parse options after double dash', () => {
      expect(commandLineParser(['--', '--a', '--b'])).toEqual({ $: ['--a', '--b'] });
      expect(commandLineParser(['--a', '--', '--b'])).toEqual({ a: true, $: ['--b'] });
      expect(commandLineParser(['--a', '--b', '--'])).toEqual({ a: true, b: true, $: [] });
    });
  });
});
