import {AppCache, AppConfig, Assessment, KeyCapture, KeyEvent} from "./model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listKeyDefs, nextKeyPrompt} from "../../common/key-key";
import {RatedKeyDef} from "../../common/key-model";
import {AssessmentConst, evaluate, isKeyDefMatch, PERFECT} from "./assessment";
import {Timestamper} from "../../common/timing";

interface MainState {
    /** The next keys being shown to the user for echoing */
    keyPrompt: RatedKeyDef[],

    /** The history of keys pressed up to a maximum length */
    keyHistory: KeyEvent[],

    /** Incorrect keystrokes entered by the user since the last correct keystroke */
    buffer: KeyCapture[],

    /** The current assessment result for user to observe */
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
        difficultyAutoAdjust: true,
        difficultyTarget: PERFECT / 10, // quite low
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

            if (canConsume) {
                state.keyHistory.push({
                    ...keyCapture,
                    prompt
                });
                state.buffer.length = 0;
                state.keyPrompt.shift();
            } else if (mode === "Buffer" || mode === "Ignore") {
                state.buffer.push(keyCapture);
            }

            // this likely won't include the last few key strokes but is OK for now
            const evalIsDue = keyCapture.keyedAt >= (state.assessment?.assessedAt ?? 0) + 1200;
            if (evalIsDue) {
                state.assessment = evaluate(state.keyHistory);

                // only auto adjust after a fresh assessment
                if (state.config.difficultyAutoAdjust) {
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
    const desiredAccuracy = state.config.errorHandlingMode !== "Accept" ? PERFECT : AssessmentConst.STEADY_ACCURACY;
    const desiredCombo = Math.sqrt(desiredAccuracy * AssessmentConst.STEADY_SPEED);
    const actualCombo = Math.sqrt(assessment.accuracy * assessment.speed);
    const delta = (desiredCombo - actualCombo) / AssessmentConst.DIFFICULTY_GAIN_QUOTIENT;
    // want rating to go down if current is < desired and VV.
    let difficultyTarget = state.config.difficultyTarget - delta;
    difficultyTarget = Math.max(0, difficultyTarget);
    difficultyTarget = Math.min(PERFECT, difficultyTarget);
    difficultyTarget = Math.round(difficultyTarget);
    console.log(`New difficulty: ${delta < 0 ? '-' : '+'}${Math.abs(delta)} = ${difficultyTarget}`)
    state.config.difficultyTarget = difficultyTarget;
    state.autoAdjustedAt = Timestamper();
}

function manageKeys(state: MainState) {
    let historyLength = state.keyHistory.length;
    while (historyLength > 10) {
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
    maxIndex = Math.round((maxIndex - 1) * state.config.difficultyTarget / PERFECT) + 1; // min 2 chars
    const available = state.cache!.availableKeys.slice(0, maxIndex + 1);
    while (state.keyPrompt.length < 6) {
        const next = nextKeyPrompt(available, state.keyPrompt);
        state.keyPrompt.push(next);
    }
}

export const {keyPressed, backspaced, configChanged} = mainSlice.actions;
export default mainSlice.reducer;
