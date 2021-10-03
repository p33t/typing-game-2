import {PERFECT, permittedKeys} from "./assessment";
import {AppConfig} from "./model";

const allKeys: AppConfig = {
    keySetName: "US Home Keys",
    shiftEnabled: true,
    controlEnabled: true,
    altEnabled: true,
    autoAdjustDifficulty: true,
};
const shiftOnly: AppConfig = {...allKeys, altEnabled: false, controlEnabled: false};

test('permittedKeys() all keys, max difficulty', () => {
    const actual = permittedKeys(allKeys, PERFECT);
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

test('permittedKeys() all keys, easiest', () => {
    const actual = permittedKeys(allKeys, 0);
    expect(actual.length).toBe(1);

    const actual0 = actual[0];
    expect(actual0.char).toBe('j');
    expect(actual0.shift).toBe(false);
    expect(actual0.control).toBe(false);
    expect(actual0.alt).toBe(false);
});

test('permittedKeys() shift-only keys, 50%', () => {
    const actual = permittedKeys(shiftOnly, 50);
    expect(actual.length).toBe(8);
    
    const actualN = actual[actual.length - 1];
    expect(actualN.char).toBe('a');
    expect(actualN.shift).toBe(false);
    expect(actualN.control).toBe(false);
    expect(actualN.alt).toBe(false);
});

test('permittedKeys() shift-only keys, 75%', () => {
    const actual = permittedKeys(shiftOnly, 75);
    expect(actual.length).toBe(12);
    
    const actualN = actual[actual.length - 1];
    expect(actualN.char).toBe('d');
    expect(actualN.shift).toBe(true);
    expect(actualN.control).toBe(false);
    expect(actualN.alt).toBe(false);
});
