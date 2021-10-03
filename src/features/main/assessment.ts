import {Percent} from "./model";
import {KeyDef} from "../../common/key-model";

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

export function permittedKeys(availableSorted: KeyDef[], difficulty: Percent): KeyDef[] {
    
    let ixEnd = Math.round((availableSorted.length * difficulty / PERFECT));
    if (ixEnd === 0) ixEnd++; // bottom out with a single element
    if (ixEnd < availableSorted.length) return availableSorted.slice(0, ixEnd);
    
    return availableSorted;
}

// export function evaluate(config: AppConfig, history: KeyCapture[]): Assessment {
//    
// }
