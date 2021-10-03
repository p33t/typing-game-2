import {AppConfig, KeyDef, Percent} from "./model";
import {DIFFICULTY_BOOST, keySet} from "../../common/key-key";

export const PERFECT: Percent = 100;
// export const AssessmentConst = {
//     PERFECT_KEY_RATE_DEFAULT: 7, // equals a score of 100% for keys per sec (default)
//     // PERFECT_KEY_RATE_MIN: 1, // need at least one key per second as the goal
//     // PERFECT_KEY_RATE_MAX: 8, // at most 8 key per second as the goal
//     HISTORY_SIZE: 50, // size of sample for assessment  
//     DURATION_MAX_THRESHOLD: 2000, // won't get penalized above this == 0%
//     DURATION_MAX_FACTOR: 10, // 10 times slower than perfect is 0% (unless threshold is activated)
//     DIFFICULTY_GAIN_QUOTIENT: 8, // 1/x proportion of the difference will be compensated (default)
//     STEADY_ACCURACY: .9 * PERFECT, // the accuracy that is deemed desirable
//     STEADY_SPEED: .7 * PERFECT, // the speed that is deemed desirable
// }
//
// export const GenerationConstant = {
//     DISPLAY_BUFFER_SIZE: 10, // the number of chars shown to the user
//     // EASY_KEY_TRANSITION_QUOTIENT: 8, // 1/x proportion of the range for the transition (more is steeper)
//     // NON_REPEAT_QUOTIENT: 10, // 1/x proportion of the range for the beginning of recent use gradient
//     // 10 = a 10th of the recent keys will be seriously improbable
//     // NON_REPEAT_TRANSITION_QUOTIENT: 5, // 1/x proportion of the curve in the transition to fully probably recent use
//
//     HIGH_PROBABILITY: 20,
// };

interface KeyDefPlus extends KeyDef {
    difficulty: number,
}

// export function generateKey(config: AppConfig, difficulty: Percent, recentKeys: string[], random?: number): KeyDef {
export function permittedKeys(config: AppConfig, difficulty: Percent): KeyDef[] {
    // explode into variations based on configuration
    const templates = [{
        char: '',
        alt: false,
        control: false,
        shift: false,
        difficulty: 0,
    }];
    if (config.shiftEnabled) {
        templates.push(...templates.map(t =>
            ({...t, shift: true, difficulty: t.difficulty + DIFFICULTY_BOOST.shift}) as KeyDefPlus));
    }
    
    if (config.controlEnabled) {
        templates.push(...templates.map(t =>
            ({...t, control: true, difficulty: t.difficulty + DIFFICULTY_BOOST.control}) as KeyDefPlus));
    }
    
    if (config.altEnabled) {
        templates.push(...templates.map(t =>
            ({...t, alt: true, difficulty: t.difficulty + DIFFICULTY_BOOST.alt}) as KeyDefPlus));
    }

    let result: KeyDefPlus[] = [];
    for (const [key, difficulty] of keySet(config.keySetName).entries()) {
        result.push(...templates.map(t => ({...t, char: key, difficulty: t.difficulty + difficulty})));
    }
    
    // keep portion that is within difficulty range
    result.sort((l,r) => l.difficulty === r.difficulty
        ? 0
        : l.difficulty > r.difficulty
            ? 1
            : -1);
    let ixEnd = Math.round((result.length * difficulty / PERFECT));
    if (ixEnd === 0) ixEnd++; // bottom out with a single element
    if (ixEnd < result.length) result = result.slice(0, ixEnd);
    
    return result;
}

