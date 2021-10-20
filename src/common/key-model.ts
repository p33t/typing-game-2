export type Percent = number;
export const KEY_SET_NAMES = ['US Home Keys', 'US Letters', 'US Letters, Symbols'] as const;
export type KeySetName = typeof KEY_SET_NAMES[number];

export type KeySet = ReadonlyMap<string, number>;

export interface KeyDef {
    char: string,
    control: boolean,
    alt: boolean,
    shift: boolean,
}

export interface RatedKeyDef extends KeyDef{
    relativeDifficulty: number,
    normDifficulty: Percent,
}