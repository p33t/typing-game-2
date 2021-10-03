import {KeyDef, KeySet, KeySetName} from "./key-model";

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
        difficulty: 0,
    } as KeyDef];
    if (shiftEnabled) {
        templates.push(...templates.map(t =>
            ({...t, shift: true, difficulty: t.difficulty + DIFFICULTY_BOOST.shift}) as KeyDef));
    }

    if (controlEnabled) {
        templates.push(...templates.map(t =>
            ({...t, control: true, difficulty: t.difficulty + DIFFICULTY_BOOST.control}) as KeyDef));
    }

    if (altEnabled) {
        templates.push(...templates.map(t =>
            ({...t, alt: true, difficulty: t.difficulty + DIFFICULTY_BOOST.alt}) as KeyDef));
    }

    let result: KeyDef[] = [];
    for (const [key, difficulty] of keySet(keySetName).entries()) {
        result.push(...templates.map(t => ({...t, char: key, difficulty: t.difficulty + difficulty})));
    }

    // sort by difficulty and keep in original declared order if same difficulty
    result.sort((l,r) => l.difficulty === r.difficulty
        ? 0
        : l.difficulty > r.difficulty
            ? 1
            : -1);
    return result;
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
