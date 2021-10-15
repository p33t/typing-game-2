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

export type AppConfig = {
    keySetName: KeySetName;
    shiftEnabled: boolean;
    altEnabled: boolean;
    controlEnabled: boolean;
    difficultyAutoAdjust: boolean;
    difficultyTarget: Percent,
};

export type AppCache = {
    configHash: string;
    availableKeys: KeyDef[];
}
