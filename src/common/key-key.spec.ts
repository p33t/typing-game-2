import {defaultShiftCharFor, enumerateKeySet, keyRating} from './key-key';

const isUnique = (arr: string[]) => new Set(arr).size === arr.length;

test('key count', () => {
    expect(enumerateKeySet("US Letters, Symbols").length).toBe(47);
    expect(enumerateKeySet("US Letters").length).toBe(26);
});

test('key unique', () => {
    expect(isUnique(enumerateKeySet("US Letters, Symbols"))).toBe(true);
    expect(isUnique(enumerateKeySet("US Letters"))).toBe(true);
});

test('key rating functions', () => {
    expect(keyRating("US Letters", 'y')).toBe(35);
    expect(keyRating("US Letters, Symbols", '=')).toBe(60);
});

test('default shift char for', () => {
    const shifted = enumerateKeySet("US Letters, Symbols").map(ch => {
        expect(ch.length).toBe(1);
        const alt = defaultShiftCharFor(ch);
        expect(alt.length).toBe(1);
        expect(alt).not.toBe(ch);
        return alt;
    });

    expect(isUnique(shifted)).toBe(true);
});
