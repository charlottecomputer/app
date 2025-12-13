import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KeyResult, Objective } from '../types';

export interface OkrState {
    keyResults: KeyResult[];
    objectives: Objective[];
    isLoading: boolean;
    error: string | null;
}

const initialState: OkrState = {
    keyResults: [],
    objectives: [],
    isLoading: false,
    error: null,
};

export const okrSlice = createSlice({
    name: 'okr',
    initialState,
    reducers: {
        setKeyResults: (state, action: PayloadAction<KeyResult[]>) => {
            state.keyResults = action.payload;
        },
        setObjectives: (state, action: PayloadAction<Objective[]>) => {
            state.objectives = action.payload;
        },
        addKeyResult: (state, action: PayloadAction<KeyResult>) => {
            state.keyResults.push(action.payload);
        },
        updateKeyResult: (state, action: PayloadAction<KeyResult>) => {
            const index = state.keyResults.findIndex(kr => kr.keyResultId === action.payload.keyResultId);
            if (index !== -1) {
                state.keyResults[index] = action.payload;
            }
        },
        deleteKeyResult: (state, action: PayloadAction<string>) => {
            state.keyResults = state.keyResults.filter(kr => kr.keyResultId !== action.payload);
        },
        addObjective: (state, action: PayloadAction<Objective>) => {
            state.objectives.push(action.payload);
        },
        updateObjective: (state, action: PayloadAction<Objective>) => {
            const index = state.objectives.findIndex(obj => obj.projectId === action.payload.projectId);
            if (index !== -1) {
                state.objectives[index] = action.payload;
            }
        },
        deleteObjective: (state, action: PayloadAction<string>) => {
            state.objectives = state.objectives.filter(obj => obj.projectId !== action.payload);
        },
        setOkrLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setKeyResults,
    setObjectives,
    addKeyResult,
    updateKeyResult,
    deleteKeyResult,
    addObjective,
    updateObjective,
    deleteObjective,
    setOkrLoading,
    setError,
} = okrSlice.actions;

export default okrSlice.reducer;
