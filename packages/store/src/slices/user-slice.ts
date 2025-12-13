import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    userId: string | null;
    name: string | null;
    email: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: UserState = {
    userId: null,
    name: null,
    email: null,
    isAuthenticated: false,
    isLoading: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ userId: string; name: string; email: string }>) => {
            state.userId = action.payload.userId;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        clearUser: (state) => {
            state.userId = null;
            state.name = null;
            state.email = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setUser, clearUser, setUserLoading } = userSlice.actions;
export default userSlice.reducer;
