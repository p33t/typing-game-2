import {KeyCapture, KeySetName} from "./model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {enumerateKeySet, nextKeyPrompt} from "../../common/key-key";
import {keySetChanged} from "../config/slice";

interface MainState {
    /** The history of keys pressed up to a maximum length */
    keyHistory: KeyCapture[],

    /** The next keys being shown to the user for echoing */
    keyPrompt: string[],

    /** Message shown to the user */
    message?: string,
}


const initialState: MainState = {
    keyPrompt: [],
    keyHistory: [],
}

// TODO: Is there a better way to bootstrap the prompt array?
manageKeys(initialState, "Home Keys");

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        keyPressed(state, action: PayloadAction<{ keyCapture: KeyCapture, keySetName: KeySetName }>) {
            const {keyCapture, keySetName} = action.payload;
            if (state.keyPrompt.length === 0) {
                throw new Error("No key prompt to compare");
            }
            if (keyCapture.keyCode === state.keyPrompt[0]) {
                state.keyHistory.push(keyCapture);
                state.keyPrompt.shift();
                manageKeys(state, keySetName);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(keySetChanged, (state, action) => {
            state.keyPrompt.length = 0;
            manageKeys(state, action.payload);
        });
    }
});

function manageKeys(state: MainState, keySetName: KeySetName) {
    let historyLength = state.keyHistory.length;
    while (historyLength > 20) {
        state.keyHistory.shift();
        historyLength--;
    }

    let promptLength = state.keyPrompt.length;
    const available = enumerateKeySet(keySetName);
    while (promptLength < 5) {
        let keyPrompt = nextKeyPrompt(available);
        state.keyPrompt.push(keyPrompt);
        promptLength++;
    }
}

export const {keyPressed} = mainSlice.actions;
export default mainSlice.reducer;
