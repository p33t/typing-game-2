import {Assessment, KeyEvent, Percent} from "./model";
import {KeyDef} from "../../common/key-model";

export const PERFECT: Percent = 100;
export const AssessmentConst = {
    PERFECT_KEY_RATE_DEFAULT: 7, // equals a score of 100% for keys per sec (default)
//     // PERFECT_KEY_RATE_MIN: 1, // need at least one key per second as the goal
//     // PERFECT_KEY_RATE_MAX: 8, // at most 8 key per second as the goal
//     HISTORY_SIZE: 50, // size of sample for assessment  
    DURATION_RANGE_FACTOR: 10, // 10 times slower than perfect is 0% (unless limit is activated)
//     DIFFICULTY_GAIN_QUOTIENT: 8, // 1/x proportion of the difference will be compensated (default)
//     STEADY_ACCURACY: .9 * PERFECT, // the accuracy that is deemed desirable
//     STEADY_SPEED: .7 * PERFECT, // the speed that is deemed desirable
}
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
const DURATION_PERFECT = 1000 / AssessmentConst.PERFECT_KEY_RATE_DEFAULT;
const DURATION_0 = AssessmentConst.DURATION_RANGE_FACTOR * DURATION_PERFECT;
const DURATION_RANGE = DURATION_0 - DURATION_PERFECT;

export function permittedKeys(availableSorted: KeyDef[], difficulty: Percent): KeyDef[] {

    let ixEnd = Math.round((availableSorted.length * difficulty / PERFECT));
    if (ixEnd === 0) ixEnd++; // bottom out with a single element
    if (ixEnd < availableSorted.length) return availableSorted.slice(0, ixEnd);

    return availableSorted;
}

export function evaluate(history: KeyEvent[]): Assessment {
    const difficulty = calcDifficulty(history);
    const speed = calcSpeed(history);
    const accuracy = calcAccuracy(history);
    const cube = speed * accuracy * difficulty;
    const overall = Math.pow(cube, 1 / 3);
    
    return {
        difficulty: Math.round(difficulty),
        speed: Math.round(speed),
        accuracy: Math.round(accuracy),
        overall: Math.round(overall)
    };
}

export function isKeyDefMatch(l: KeyDef, r: KeyDef) {
    return l.char === r.char
        && l.shift === r.shift
        && l.control === r.control
        && l.alt === r.alt;
}

function average(values: number[]) {
    const sum = values.reduce((soFar, next) => soFar + next);
    return sum / values.length;
}

export function calcAccuracy(history: KeyEvent[]): Percent {
    if (history.length === 0) return PERFECT;
    const hits = history.filter(ke => isKeyDefMatch(ke, ke.prompt)).length;
    return hits * PERFECT / history.length;
}

export function calcDifficulty(history: KeyEvent[]): Percent {
    if (history.length === 0) return 0;

    const normDifficulties = history.map(ke => ke.prompt.normDifficulty!);
    return average(normDifficulties);
}

export function calcSpeed(history: KeyEvent[]): Percent {
    if (history.length <= 1) return 0;

    function calcSpeed1(prevKeyedAt: number, nextKeyedAt: number): number {
        const duration = nextKeyedAt - prevKeyedAt;
        let normDuration = (duration - DURATION_PERFECT) * PERFECT / DURATION_RANGE;
        normDuration = Math.max(0, normDuration);
        normDuration = Math.min(PERFECT, normDuration);
        return PERFECT - normDuration;
    }

    const speeds = history.flatMap((ke, index) =>
        index === 0
            ? []
            : [calcSpeed1(history[index - 1].keyedAt, history[index].keyedAt)]);
    return average(speeds);
}
