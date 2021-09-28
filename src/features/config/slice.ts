import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { KeySetName } from "../main/model";

interface ConfigState {
    keySetName: KeySetName,
}

const initialState: ConfigState = {
    keySetName: "Home Keys",
}

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        keySetChanged(state, action: PayloadAction<KeySetName>) {
            state.keySetName = action.payload;
        },
    },
});

export const { keySetChanged } = configSlice.actions;
export default configSlice.reducer;
