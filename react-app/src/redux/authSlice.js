import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    name: '',
    email: '',
    neighborhood: '',
    access: '',
    refresh: '',
    loading: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
        },
        storeUserInformation: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.neighborhood = action.payload.neighborhood;
        },
        logout: (state) => {
            state.name = '';
            state.email = '';
            state.neighborhood = '';
            state.access = '';
            state.refresh = '';
        },
    },
});

export const { login, logout, storeUserInformation } = authSlice.actions;

export const selectAuth = (state) => state.auth;