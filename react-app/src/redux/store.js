import { combineReducers, createStore } from 'redux';
import { authSlice } from './authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'auth',
    storage,
};

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authSlice.reducer),
});

export const store = createStore(rootReducer);

export const persistor = persistStore(store);
