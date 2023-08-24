import { getReversingStringSteps } from './utils'; // Замените на актуальный путь к вашей функции

describe('getReversingStringSteps', () => {

  it('корректно разворачивает строку с чётным количеством символов', () => {
    const result = getReversingStringSteps('abcd');
    expect(result).toEqual([['d', 'b', 'c', 'a'], ['d', 'c', 'b', 'a']]);
  });

  it('корректно разворачивает строку с нечетным количеством символов', () => {
    const result = getReversingStringSteps('abcde');
    expect(result).toEqual([['e', 'b', 'c', 'd', 'a'], ['e', 'd', 'c', 'b', 'a']]);
  });

  it('корректно разворачивает строку с одним символом', () => {
    const result = getReversingStringSteps('a');
    expect(result).toEqual([]);
  });

  it('корректно разворачивает пустую строку', () => {
    const result = getReversingStringSteps('');
    expect(result).toEqual([]);
  });

});
