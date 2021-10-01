export const KeySetNames = ["Home Keys", "Home Row"] as const; // TODO: More names
export type KeySetName = typeof KeySetNames[number];

export type Timestamp = number;

export type KeyDef = {
    char: string,
    ctrl: boolean,
    alt: boolean,
    shift: boolean,
};

export type KeyCapture = {
    keyedAt: Timestamp,
    keyDef: KeyDef,
}
