import {KeyDef, KeySetName} from "../../common/key-model";

export type Timestamp = number;

export interface KeyCapture extends KeyDef {
    keyedAt: Timestamp,
}

export interface KeyEvent extends KeyCapture {
    prompt: KeyDef,
}

export type Percent = number;

export type Assessment = {
    difficulty: Percent,
    accuracy: Percent,
    speed: Percent,
    // keyCount: number,
    // correctCount: number,
    overall: Percent,
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
