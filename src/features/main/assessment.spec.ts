import {AssessmentConst, calcAccuracy, calcDifficulty, calcSpeed, evaluate, PERFECT} from './assessment';
import {KeyEvent} from './model';
import {KeyDef} from '../../common/key-model';

function createHistory(eventCount: number): KeyEvent[] {
    const aMax: KeyDef = {char: 'a', alt: true, shift: true, control: true};
    const result: KeyEvent[] = [];
    for (let ix = 0; ix < eventCount; ix++) {
        result.push({
            ...aMax,
            keyedAt: ix,
            prompt: {...aMax, difficulty: 20, normDifficulty: 80}
        });
    }
    return result;
}

test('calcAccuracy()', () => {
    const history = createHistory(3);
    history[0].char = 'b'; // wrong input
    expect(calcAccuracy(history)).toBe(PERFECT * 2 / 3);
    expect(calcAccuracy([])).toBe(PERFECT);
});

test('calcDifficulty()', () => {
    const history = createHistory(3);
    history[0].prompt.normDifficulty = 50; // much less difficult
    expect(calcDifficulty(history)).toBe((50 + 80 + 80) / 3);
    expect(calcDifficulty([])).toBe(0);
});

const PERFECT_DURATION = 1000 / AssessmentConst.PERFECT_KEY_RATE_DEFAULT;
const WORST_DURATION = AssessmentConst.DURATION_RANGE_FACTOR * PERFECT_DURATION;

test('calcSpeed()', () => {
    const history = createHistory(5);
    history[1].keyedAt = PERFECT_DURATION; // 100 %
    history[2].keyedAt = history[1].keyedAt * (AssessmentConst.DURATION_RANGE_FACTOR + 1); // 0 %
    history[3].keyedAt = history[2].keyedAt; // 0 duration (infinitely good)
    history[4].keyedAt = history[3].keyedAt + 10000; // really bad
    expect(calcSpeed(history)).toBe(50); // average to mid-way
    expect(calcSpeed([])).toBe(0);
});

test('evaluate()', () => {
    const history = createHistory(2);
    history[0].char = 'b'; // wrong input => 50% accuracy
    history[0].prompt.normDifficulty = 60; // less difficult => 70% avg
    history[1].keyedAt = (WORST_DURATION + PERFECT_DURATION) / 2; // 50% speed 
    expect(evaluate(history).overall).toBe(56); //Math.round(Math.pow(50 * 70 * 50, 1 / 3)));
});
