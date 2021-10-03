import {KeySetName} from "../../common/key-key";

export type Timestamp = number;

export type KeyDef = {
    char: string,
    control: boolean,
    alt: boolean,
    shift: boolean,
};

export type KeyCapture = {
    keyedAt: Timestamp,
    keyDef: KeyDef,
}

export type Score = number;
export type Percent = number;

export type Assessment = {
    difficulty: Score,
    accuracy: Score,
    speed: Score,
    keyCount: number,
    correctCount: number,
    overall: Score,
}

export type AppConfig = {
    keySetName: KeySetName;
    shiftEnabled: boolean;
    altEnabled: boolean;
    controlEnabled: boolean;
    autoAdjustDifficulty: boolean;
};
