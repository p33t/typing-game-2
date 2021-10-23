import {KeyDef, KeySet, KeySetName, RatedKeyDef} from "./key-model";
import {PERFECT} from "../features/main/assessment";

function calcKeyDifficulties(obj: any): Map<string, number> {
    const tups = Object.keys(obj)
        .flatMap(prop =>
            prop.split('')
                .map(ch => {
                    const tup: [string, number] = [ch, obj[prop]];
                    return tup;
                }));
    return new Map(tups);
}

function calcKeySet(name: KeySetName, difficultiesObj: any): [KeySetName, KeySet] {
    const difficulties = calcKeyDifficulties(difficultiesObj);
    return [name, difficulties];
}

const KEY_SETS: Map<KeySetName, KeySet> = new Map<KeySetName, KeySet>(
    [
        calcKeySet('US Home Keys', {
            ['jf']: 15,
            ['kd']: 16,
            ['ls;a']: 18,
        }),
        calcKeySet('US Letters', {
            ['jf']: 15,
            ['kd']: 16,
            ['lsa']: 18,
            ['urieow']: 23,
            ['hgmcxnv']: 25,
            ['zt']: 26,
            ['bqpy']: 35,
        }),
        calcKeySet('US Letters, Symbols', {
            ['jf']: 15,
            ['kd']: 16,
            ['lsa;']: 18,
            ['urieow']: 23,
            ['ghmc,xnv']: 25,
            ['.z/t']: 26,
            ['b\'qpy[']: 35,
            [']\\']: 40,
            ['9302']: 53,
            ['7584-']: 55,
            ['=`61']: 60,
        }),
    ]
);

const DIFFICULTY_BOOST = {
    shift: 5,
    control: 6,
    alt: 8,
};

export function listKeys(name: KeySetName): string[] {
    return Array.from(KEY_SETS.get(name)!.keys());
}

export function keyRating(name: KeySetName, ch: string) {
    return KEY_SETS.get(name)!.get(ch)!;
}

export function keySet(name: KeySetName): KeySet {
    return KEY_SETS.get(name)!;
}

export function listKeyDefs(keySetName: KeySetName, shiftEnabled: boolean, controlEnabled: boolean, altEnabled: boolean) {
    // explode into variations based on configuration
    const templates = [{
        char: '',
        alt: false,
        control: false,
        shift: false,
        relativeDifficulty: 0,
        normDifficulty: 0,
    } as RatedKeyDef];
    if (shiftEnabled) {
        templates.push(...templates.map(t =>
            ({...t, shift: true, relativeDifficulty: t.relativeDifficulty! + DIFFICULTY_BOOST.shift}) as RatedKeyDef));
    }

    if (controlEnabled) {
        templates.push(...templates.map(t =>
            ({...t, control: true, relativeDifficulty: t.relativeDifficulty! + DIFFICULTY_BOOST.control}) as RatedKeyDef));
    }

    if (altEnabled) {
        templates.push(...templates.map(t =>
            ({...t, alt: true, relativeDifficulty: t.relativeDifficulty! + DIFFICULTY_BOOST.alt}) as RatedKeyDef));
    }

    let result: RatedKeyDef[] = [];
    for (const [key, difficulty] of keySet(keySetName).entries()) {
        result.push(...templates.map(t => ({...t, char: key, relativeDifficulty: t.relativeDifficulty! + difficulty})));
    }

    // sort by difficulty and keep in original declared order if same difficulty
    result.sort((l, r) => l.relativeDifficulty === r.relativeDifficulty
        ? 0
        : l.relativeDifficulty > r.relativeDifficulty
            ? 1
            : -1);
    
    // TODO: Norm difficulty should be based on relative difficulty (not position)
    const increment = PERFECT / (result.length - 1);
    result.forEach((kd, index) => kd.normDifficulty = index * increment);
    
    return result;
}

const US_SHIFT_CHAR_MAP: [string, string][] = [
    ['`', '~'],
    ['1', '!'],
    ['2', '@'],
    ['3', '#'],
    ['4', '$'],
    ['5', '%'],
    ['6', '^'],
    ['7', '&'],
    ['8', '*'],
    ['9', '('],
    ['0', ')'],
    ['-', '_'],
    ['=', '+'],
    ['[', '{'],
    [']', '}'],
    ['\\', '|'],
    [';', ':'],
    ['\'', '"'],
    [',', '<'],
    ['.', '>'],
    ['/', '?'],
    ['Backspace', 'BACKSPACE'],
];

export function defaultShiftCharFor(rawChar: string) {
    for (const [raw, shifted] of US_SHIFT_CHAR_MAP) {
        if (rawChar === raw) return shifted;
    }
    return rawChar.toUpperCase();
}

export function defaultRawCharFor(shiftedChar: string) {
    for (const [raw, shifted] of US_SHIFT_CHAR_MAP) {
        if (shiftedChar === shifted) return raw;
    }
    return shiftedChar.toLowerCase();
}

/** Randomly selects a key from those available while avoiding the given recent keys */
export function nextKeyPrompt(available: RatedKeyDef[], recent: KeyDef[]): RatedKeyDef {
    let attempts = 0;
    let candidate: RatedKeyDef | undefined;
    while (attempts < 4) {
        attempts++;
        const ix = Math.floor(Math.random() * available.length);
        candidate = available[ix];
        if (recent.find(kd => kd.char === candidate!.char) === undefined) {
            return candidate;
        }
    }
    return candidate!;
}
