import {assess, AssessmentConst, calcMovingAverage, PERFECT} from './assessment';
import {KeyEvent} from './model';
import {KeyDef} from '../../common/key-model';

function createHistory(eventCount: number): KeyEvent[] {
    const aMax: KeyDef = {char: 'a', alt: true, shift: true, control: true};
    const result: KeyEvent[] = [];
    for (let ix = 0; ix < eventCount; ix++) {
        result.push({
            ...aMax,
            keyedAt: ix,
            prompt: {...aMax, relativeDifficulty: 20, normDifficulty: 80},
            assessment: {
                difficulty: 0,
                overall: 0,
                accuracy: 0,
                speed: 0,
                assessedAt: ix,
            },
        });
    }
    return result;
}

test('assess() accurate, fast', () => {
    const keyEvent = createHistory(1)[0];
    const actual = assess(keyEvent.prompt, PERFECT_INTERVAL, keyEvent);
    expect(actual.speed).toBe(PERFECT);
    expect(actual.difficulty).toBe(80);
    expect(actual.accuracy).toBe(PERFECT);
    expect(actual.overall).toBe(280 / 3)
});

test('assess() inaccurate, slow', () => {
    const keyEvent = createHistory(1)[0];
    keyEvent.prompt.char = 'b'; // inaccurate
    keyEvent.prompt.normDifficulty = 90;
    const actual = assess(keyEvent.prompt, WORST_INTERVAL, keyEvent);
    expect(actual.speed).toBe(0);
    expect(actual.difficulty).toBe(90);
    expect(actual.accuracy).toBe(0);
    expect(actual.overall).toBe(90 / 3)
});

const PERFECT_INTERVAL = 1000 / AssessmentConst.PERFECT_KEY_RATE_DEFAULT;
const WORST_INTERVAL = AssessmentConst.INTERVAL_RANGE_FACTOR * PERFECT_INTERVAL;

test('calcMovingAverage()', () => {
    const history = createHistory(3);
    history[0].assessment = undefined;
    history[1].assessment!.speed = 20;
    history[1].assessment!.accuracy = 30;
    history[1].assessment!.difficulty = 40;
    history[2].assessment!.speed = 50;
    history[2].assessment!.accuracy = 60;
    history[2].assessment!.difficulty = 70;
    const avg = calcMovingAverage(history);
    expect(avg.speed).toBe(35);
    expect(avg.accuracy).toBe(45);
    expect(avg.difficulty).toBe(55);
    expect(avg.overall).toBe(45);
});
