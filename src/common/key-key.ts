// TODO: +5 for shift key.  +6 for ctrl, +8 for alt?

type KeyRatings = {
    "US Letters": object,
    "US Letters, Symbols": object
};
const KEY_RATINGS: KeyRatings = {
    "US Letters":  {
        ['asdfjkl']: 15 ,
        ['weruio']: 23 ,
        ['ghmcxnv']: 25 ,
        ['zt']: 26 ,
        ['bqpy']: 35 ,
    },
    "US Letters, Symbols": {
        ['asdfjkl;']: 15,
        ['weruio']: 23,
        ['ghmc,xnv']: 25,
        ['.z/t']: 26,
        ['b\'qpy[']: 35,
        [']\\']: 40,
        ['2390']: 53,
        ['4578-']: 55,
        ['`=16']: 60,
    },
};

export type KeySetName = keyof KeyRatings;
export const KeySetNames = Object.keys(KEY_RATINGS);

type KeyRatingMaps = {
    [Property in keyof KeyRatings]: Map<string, number>;
}

function calcKeyRatingMaps(obj: any): Map<string, number> {
    const tups = Object.keys(obj)
        .flatMap(prop =>
            prop.split('')
            .map(ch => {
                const tup: [string, number] = [ch, obj[prop]];
                return tup;
            }));
    return new Map(tups);
}

const KEY_RATING_MAP: KeyRatingMaps = {
    "US Letters": calcKeyRatingMaps(KEY_RATINGS["US Letters"]),
    "US Letters, Symbols": calcKeyRatingMaps(KEY_RATINGS["US Letters, Symbols"]),
};

export function enumerateKeySet(name: KeySetName): string[] {
    return Array.from(KEY_RATING_MAP[name].keys());
}

export function keyRating(name: KeySetName, ch: string) {
   return KEY_RATING_MAP[name].get(ch)!;
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
