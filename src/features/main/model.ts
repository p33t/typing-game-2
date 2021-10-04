import {KeyDef, KeySetName} from "../../common/key-model";

export type Timestamp = number;

export interface KeyCapture extends KeyDef {
    keyedAt: Timestamp,
}

export interface KeyEvent extends KeyCapture {
    prompt: KeyDef,
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

export type AppCache = {
    configHash: string;
    availableKeys: KeyDef[];
}
