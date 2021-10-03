import {defaultShiftCharFor, listKeys, keyRating} from './key-key';

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
