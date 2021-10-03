import {KeyDef, KeySetName} from "../../common/key-model";

export type Timestamp = number;

export type KeyCapture = {
    keyedAt: Timestamp,
    keyDef: KeyDef,
}

export type Percent = number;
export type Score = number;

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
