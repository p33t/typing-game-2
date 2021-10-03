import {defaultShiftCharFor, listKeys, keyRating, listKeyDefs} from './key-key';
import {PERFECT, permittedKeys} from "../features/main/assessment";

const isUnique = (arr: string[]) => new Set(arr).size === arr.length;

test('key count', () => {
    expect(listKeys('US Home Keys').length).toBe(8);
    expect(listKeys('US Letters').length).toBe(26);
    expect(listKeys('US Letters, Symbols').length).toBe(47);
});

test('key unique', () => {
    expect(isUnique(listKeys('US Home Keys'))).toBe(true);
    expect(isUnique(listKeys('US Letters'))).toBe(true);
    expect(isUnique(listKeys('US Letters, Symbols'))).toBe(true);
});

test('key rating functions', () => {
    expect(keyRating('US Home Keys', 'j')).toBe(15);
    expect(keyRating('US Letters', 'y')).toBe(35);
    expect(keyRating('US Letters, Symbols', '=')).toBe(60);
});

test('default shift char for', () => {
    const shifted = listKeys('US Letters, Symbols').map(ch => {
        expect(ch.length).toBe(1);
        const alt = defaultShiftCharFor(ch);
        expect(alt.length).toBe(1);
        expect(alt).not.toBe(ch);
        return alt;
    });

    expect(isUnique(shifted)).toBe(true);
});


test('listKeyDefs() all keys', () => {
    const actual = listKeyDefs('US Home Keys', true,  true, true);
    expect(actual.length).toBe(8 * 2 * 2 * 2);

    const actual0 = actual[0];
    expect(actual0.char).toBe('j');
    expect(actual0.shift).toBe(false);
    expect(actual0.control).toBe(false);
    expect(actual0.alt).toBe(false);

    const actualN = actual[actual.length - 1];
    expect(actualN.char).toBe('a');
    expect(actualN.shift).toBe(true);
    expect(actualN.control).toBe(true);
    expect(actualN.alt).toBe(true);
});

test('listKeyDefs() shift-only keys', () => {
    const actual = listKeyDefs('US Home Keys', true, false, false);
    expect(actual.length).toBe(16);

    const actualN = actual[actual.length - 1];
    expect(actualN.char).toBe('a');
    expect(actualN.shift).toBe(true);
    expect(actualN.control).toBe(false);
    expect(actualN.alt).toBe(false);
});
