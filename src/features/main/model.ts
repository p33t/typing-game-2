import {KeyDef, KeySetName, Percent, RatedKeyDef} from "../../common/key-model";

export type Timestamp = number;

export interface KeyCapture extends KeyDef {
    keyedAt: Timestamp,
}

export interface KeyEvent extends KeyCapture {
    prompt: RatedKeyDef,
}

export type Assessment = {
    assessedAt: number,
    difficulty: Percent,
    accuracy: Percent,
    speed: Percent,
    overall: Percent,
}

export const ERROR_HANDLING_MODES = ['Ignore', 'Accept', 'Buffer'] as const;
export type ErrorHandlingMode = typeof ERROR_HANDLING_MODES[number];

export type AppConfig = {
    keySetName: KeySetName;
    shiftEnabled: boolean;
    altEnabled: boolean;
    controlEnabled: boolean;
    difficultyAutoAdjust: boolean;
    difficultyTarget: Percent,
    errorHandlingMode: ErrorHandlingMode,
};

export type AppCache = {
    configHash: string;
    availableKeys: RatedKeyDef[];
}
