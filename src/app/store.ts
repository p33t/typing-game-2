import {configureStore} from "@reduxjs/toolkit";
import configReducer from '../features/config/slice'
import mainReducer from '../features/main/slice'

export const store = configureStore({
    reducer: {
        config: configReducer,
        main: mainReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
