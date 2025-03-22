import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    firstname: '',
    lastname: '',
    email: '',
    neighborhood: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.firstname = action.payload.firstname;
            state.lastname = action.payload.lastname;
            state.email = action.payload.email;
            state.neighborhood = action.payload.neighborhood
        },
        logout: (state) => {
            state.firstname = '';
            state.lastname = '';
            state.email = '';
            state.neighborhood = '';
        },
    },
});

export const { login, logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;