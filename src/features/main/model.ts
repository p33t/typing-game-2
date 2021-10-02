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
