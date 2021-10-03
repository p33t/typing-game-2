export const KEY_SET_NAMES = ['US Home Keys', 'US Letters', 'US Letters, Symbols'] as const;
export type KeySetName = typeof KEY_SET_NAMES[number];

export type KeySet = ReadonlyMap<string, number>;

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
            ['jfkd']: 15,
            ['ls;a']: 18,
        }),
        calcKeySet('US Letters', {
            ['asdfjkl']: 15,
            ['weruio']: 23,
            ['ghmcxnv']: 25,
            ['zt']: 26,
            ['bqpy']: 35,
        }),
        calcKeySet('US Letters, Symbols', {
            ['asdfjkl;']: 15,
            ['weruio']: 23,
            ['ghmc,xnv']: 25,
            ['.z/t']: 26,
            ['b\'qpy[']: 35,
            [']\\']: 40,
            ['2390']: 53,
            ['4578-']: 55,
            ['`=16']: 60,
        }),
    ]
);

export const DIFFICULTY_BOOST = {
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
 
export function defaultShiftCharFor(rawChar: string) {
    switch (rawChar) {
        case '`':
            return '~';
        case '1':
            return '!';
        case '2':
            return '@';
        case '3':
            return '#';
        case '4':
            return '$';
        case '5':
            return '%';
        case '6':
            return '^';
        case '7':
            return '&';
        case '8':
            return '*';
        case '9':
            return '(';
        case '0':
            return ')';
        case '-':
            return '_';
        case '=':
            return '+';
        case '[':
            return '{';
        case ']':
            return '}';
        case '\\':
            return '|';
        case ';':
            return ':';
        case '\'':
            return '"';
        case ',':
            return '<';
        case '.':
            return '>';
        case '/':
            return '?';
        default:
            return rawChar.toUpperCase();
    }
}

export function nextKeyPrompt(available: string[]) {
    // TODO: This needs to get more elaborate and incorporate a probability profile
    const ix = Math.floor(Math.random() * available.length);
    return available[ix];
}
