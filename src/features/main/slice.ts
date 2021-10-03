import {AppConfig, Assessment, KeyCapture, KeyDef} from "./model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listKeys, KeySetName, nextKeyPrompt} from "../../common/key-key";

interface MainState {
    /** The history of keys pressed up to a maximum length */
    keyHistory: KeyCapture[],

    /** The next keys being shown to the user for echoing */
    keyPrompt: KeyDef[],

    /** Incorrect keystrokes entered by the user since the last correct keystroke */
    buffer: KeyCapture[],

    /** The current assessment result for user to observe */
    assessment?: Assessment,

    /** Message shown to the user */
    message?: string,
    
    /** User editable configuration */
    config: AppConfig,
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

            const isMatch = () => state.buffer.length > 0
                && state.keyPrompt.length > 0
                && state.buffer[0].keyDef.char === state.keyPrompt[0].char; // TODO: Deep compare

            while (isMatch()) {
                const consumed = state.buffer.shift();
                state.keyHistory.push(consumed!);
                state.keyPrompt.shift();
            }
            manageKeys(state);
        },
        backspaced(state) {
            state.buffer.length = Math.max(state.buffer.length - 1, 0);
        },
        keySetChanged(state, action: PayloadAction<KeySetName>) {
            state.config.keySetName = action.payload;
            state.keyPrompt.length = 0;
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

    let promptLength = state.keyPrompt.length;
    const available = listKeys(state.config.keySetName);
    while (promptLength < 5) {
        const nextChar = nextKeyPrompt(available);
        const nextDef: KeyDef = {char: nextChar, alt: false, control: false, shift: false};
        state.keyPrompt.push(nextDef);
        promptLength++;
    }
//    
//     const assessment = assess(state.keyHistory);
// }
//
// function assess(keyHistory: KeyCapture[]) {
//    
}

export const {keyPressed, backspaced, keySetChanged} = mainSlice.actions;
export default mainSlice.reducer;
