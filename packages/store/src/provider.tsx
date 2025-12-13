"use client";

import { Provider } from "react-redux";
import { store, RootState, AppDispatch } from "./store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
