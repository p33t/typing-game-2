import {AppCache, AppConfig, Assessment, KeyCapture, KeyEvent} from "./model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listKeyDefs, nextKeyPrompt} from "../../common/key-key";
import {RatedKeyDef} from "../../common/key-model";
import {assess, AssessmentConst, calcMovingAverage, isKeyDefMatch, PERFECT} from "./assessment";
import {Timestamper} from "../../common/timing";

interface MainState {
    /** The next keys being shown to the user for echoing */
    keyPrompt: RatedKeyDef[],

    /** The history of keys pressed up to a maximum length */
    keyHistory: KeyEvent[],

    /** Incorrect keystrokes entered by the user since the last correct keystroke */
    buffer: KeyCapture[],

    /** The current assessment result for user to observe. This is a moving average of KeyEvent.assessment values*/
    assessment?: Assessment,

    /** Message shown to the user */
    message?: string,

    /** User editable configuration */
    config: AppConfig,

    /** Saves values that are a little expensive to compute every keystroke */
    cache?: AppCache,

    /** The last time the difficulty was auto adjusted */
    autoAdjustedAt?: number,

    /** Flag indicating user has interacted with the UI */
    touched: boolean,
}

const initialState: MainState = {
    keyPrompt: [],
    keyHistory: [],
    buffer: [],
    touched: false,
    config: {
        keySetName: "US Letters",
        shiftEnabled: true,
        controlEnabled: false,
        altEnabled: false,
        keyRangeAutoAdjust: true,
        keyRange: PERFECT / 10, // quite low
        errorHandlingMode: "Ignore",
    },
}

// TODO: Is there a better way to bootstrap the prompt array?
manageKeys(initialState);

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        keyPressed(state, action: PayloadAction<{ keyCapture: KeyCapture }>) {
            state.touched = true;
            const {keyCapture} = action.payload;
            if (state.keyPrompt.length === 0) {
                throw new Error("No key prompt to compare");
            }

            const prompt = state.keyPrompt[0];

            const isMatch = isKeyDefMatch(keyCapture, prompt);
            const mode = state.config.errorHandlingMode;
            const canConsume = (mode === "Accept")
                || (mode === "Buffer" && state.buffer.length === 0 && isMatch)
                || (mode === "Ignore" && isMatch)
            ;

            const isFirstKeystroke = state.keyHistory.length === 0;
            const intervalMillis = isFirstKeystroke
                ? undefined
                : keyCapture.keyedAt - state.keyHistory[state.keyHistory.length - 1].keyedAt;
            const assessment = isFirstKeystroke ? undefined : assess(prompt, intervalMillis!, keyCapture);
            if (canConsume) {
                state.keyHistory.push({
                    ...keyCapture,
                    prompt,
                    assessment,
                });
                state.buffer.length = 0;
                state.keyPrompt.shift();
            } else if (mode === "Buffer" || mode === "Ignore") {
                state.buffer.push(keyCapture);
            }

            // This likely won't include the last few key strokes but is OK for now
            // Avoid assessing on first keystroke because score will be '0'
            const evalIsDue = state.keyHistory.length >= 2
                && keyCapture.keyedAt >= (state.assessment?.assessedAt ?? state.keyHistory[0]!.keyedAt) + 1200;
            if (evalIsDue) {
                state.assessment = calcMovingAverage(state.keyHistory);

                // only auto adjust after a fresh assessment
                if (state.config.keyRangeAutoAdjust) {
                    const autoAdjustIsDue = keyCapture.keyedAt >= (state.autoAdjustedAt ?? 0) + 4000;
                    if (autoAdjustIsDue) {
                        adjustDifficulty(state);
                    }
                }
            }

            manageKeys(state);
        },
        backspaced(state) {
            state.buffer.length = Math.max(state.buffer.length - 1, 0);
        },
        configChanged(state, action: PayloadAction<AppConfig>) {
            state.touched = true;
            state.config = action.payload;
            manageKeys(state);
        },
    },
});

function adjustDifficulty(state: MainState) {
    const assessment = state.assessment!;
    const desiredAccuracy = state.config.errorHandlingMode === "Accept" ? AssessmentConst.STEADY_ACCURACY : PERFECT;
    const desiredCombo = (desiredAccuracy + AssessmentConst.STEADY_SPEED) / 2;
    const actualCombo = (assessment.accuracy + assessment.speed) / 2;

    let delta = (actualCombo - desiredCombo) / AssessmentConst.KEY_RANGE_GAIN_QUOTIENT;

    if (delta >= 0) {
        if (delta < AssessmentConst.KEY_RANGE_DELTA_POSITIVE_MIN)
            delta = AssessmentConst.KEY_RANGE_DELTA_POSITIVE_MIN;
    } else {
        if (-AssessmentConst.KEY_RANGE_DELTA_NEGATIVE_MIN < delta)
            delta = -AssessmentConst.KEY_RANGE_DELTA_NEGATIVE_MIN;
    }

    let keyRangeTarget = state.config.keyRange + delta;
    keyRangeTarget = Math.max(0, keyRangeTarget);
    keyRangeTarget = Math.min(PERFECT, keyRangeTarget);
    console.log(`New difficulty: ${delta < 0 ? '-' : '+'}${Math.abs(delta)} = ${keyRangeTarget}`)
    state.config.keyRange = keyRangeTarget;
    state.autoAdjustedAt = Timestamper();
}

function manageKeys(state: MainState) {
    let historyLength = state.keyHistory.length;
    while (historyLength > 100) {
        state.keyHistory.shift();
        historyLength--;
    }

    // config elements that will void the cache 
    const configHash = JSON.stringify([
        state.config.keySetName,
        state.config.shiftEnabled,
        state.config.controlEnabled,
        state.config.altEnabled,
    ]);
    if (state.cache?.configHash !== configHash) {
        state.cache = {
            configHash,
            availableKeys: listKeyDefs(
                state.config.keySetName,
                state.config.shiftEnabled,
                state.config.controlEnabled,
                state.config.altEnabled)
        };
        state.keyPrompt.length = 0;
        state.keyHistory.length = 0;
        state.assessment = undefined;
    }

    let maxIndex = state.cache!.availableKeys.length - 1;
    // keep only those within difficulty range
    maxIndex = Math.round((maxIndex - 1) * state.config.keyRange / PERFECT) + 1; // min 2 chars
    const available = state.cache!.availableKeys.slice(0, maxIndex + 1);
    while (state.keyPrompt.length < 5) {
        const next = nextKeyPrompt(available, state.keyPrompt);
        state.keyPrompt.push(next);
    }
}

export const {keyPressed, backspaced, configChanged} = mainSlice.actions;
export default mainSlice.reducer;
