import { combineReducers, createStore } from 'redux';
import { authSlice } from './authSlice';
import { persistReducer, persistStore } from 'redux-persist';

function defaultReplacer(key, replaceCharacter) {
    return key.replace(/[^a-zA-Z0-9\-_]/g, replaceCharacter);
}

function createSecureStore(options = {}) {
    const replace_Character = "_";
    const replacer = defaultReplacer;
    
    return {
        getItem: (key) => createSecureStore.getItemAsync(replacer(key, replace_Character), options),
        setItem: (key, value) => createSecureStore.setItemAsync(replacer(key, replace_Character), value, options),
        removeItem: (key) => createSecureStore.removeItemAsync(replacer(key, replace_Character), options),
    };
}

const secureStorage = createSecureStore();

const persistConfig = {
    key: 'auth',
    storage: secureStorage,
};

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authSlice.reducer),
});

export const store = createStore(rootReducer);

export const persistor = persistStore(store);