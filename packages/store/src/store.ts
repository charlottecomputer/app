import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user-slice';
import okrReducer from './slices/okr-slice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        okr: okrReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
