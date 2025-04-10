import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authSlice } from "./authSlice";

const persistConfig = {
    key: "auth",
    storage,
};

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authSlice.reducer),
});

export const store = configureStore({
    reducer: rootReducer,
});

export const persistor = persistStore(store);
