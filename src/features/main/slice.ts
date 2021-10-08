import {AppCache, AppConfig, Assessment, KeyCapture, KeyEvent} from "./model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listKeyDefs, nextKeyPrompt} from "../../common/key-key";
import {KeyDef} from "../../common/key-model";
import {isKeyDefMatch} from "./assessment";

interface MainState {
    /** The next keys being shown to the user for echoing */
    keyPrompt: KeyDef[],
    
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
}

const initialState: MainState = {
    keyPrompt: [],
    keyHistory: [],
    buffer: [],
    config: {
        keySetName: "US Letters",  
        shiftEnabled: true,
        controlEnabled: false,
        altEnabled: false,
        autoAdjustDifficulty: true,
    },
}

// TODO: Is there a better way to bootstrap the prompt array?
manageKeys(initialState);

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        keyPressed(state, action: PayloadAction<{ keyCapture: KeyCapture }>) {
            const {keyCapture} = action.payload;
            if (state.keyPrompt.length === 0) {
                throw new Error("No key prompt to compare");
            }

            state.buffer.push(keyCapture);

            const isMatch = () => {
                if (state.buffer.length === 0) return false;
                if (state.keyPrompt.length === 0) return false;
                return isKeyDefMatch(state.buffer[0], state.keyPrompt[0]);
            }
    
            while (isMatch()) {
                const consumed = state.buffer.shift();
                const prompt = state.keyPrompt.shift();
                state.keyHistory.push({
                    ...consumed!,
                    prompt: (prompt as KeyDef)
                });
            }
            manageKeys(state);
        },
        backspaced(state) {
            state.buffer.length = Math.max(state.buffer.length - 1, 0);
        },
        configChanged(state, action: PayloadAction<AppConfig>) {
            state.config = action.payload;
            manageKeys(state);
        },
    },
});

function manageKeys(state: MainState) {
    let historyLength = state.keyHistory.length;
    while (historyLength > 20) {
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
    }

    // TODO: Will use target difficulty to truncate this array
    const available = state.cache!.availableKeys;
    while (state.keyPrompt.length < 5) {
        const next = nextKeyPrompt(available, state.keyPrompt);
        state.keyPrompt.push(next);
    }
//    
//     const assessment = assess(state.keyHistory);
// }
//
// function assess(keyHistory: KeyCapture[]) {
//    
}

export const {keyPressed, backspaced, configChanged} = mainSlice.actions;
export default mainSlice.reducer;
