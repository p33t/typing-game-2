import {PERFECT, permittedKeys} from "./assessment";
import {AppConfig} from "./model";

const allKeys: AppConfig = {
    keySetName: "US Home Keys",
    shiftEnabled: true,
    controlEnabled: true,
    altEnabled: true,
    autoAdjustDifficulty: true,
};
const shiftOnly: AppConfig = {...allKeys, altEnabled: false, controlEnabled: false};
