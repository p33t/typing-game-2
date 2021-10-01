import {KeySetName} from "../features/main/model";

export function enumerateKeySet(name: KeySetName): string[] {
    switch (name) {
        case "Home Keys":
            return ['f', 'j', 'd', 'k', 's', 'l', 'a', ';'];

        case "Home Row":
            const arr = enumerateKeySet("Home Keys");
            arr.push('g', 'h', "'");
            return arr;
    }
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
