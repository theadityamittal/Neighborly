import { Verified } from '@mui/icons-material';
import { createSlice } from '@reduxjs/toolkit';
import { add } from 'date-fns';


const initialState = {
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    neighborhood: '',
    access: '',
    refresh: '',
    user_id: '',
    verified: false,
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
            state.address = action.payload.address;
            state.phoneNumber = action.payload.phone_number;
            state.email = action.payload.email;
            state.neighborhood = action.payload.neighborhood;
            state.user_id = action.payload.user_id;
            state.verified = action.payload.verified;
        },
        setAccessToken: (state, action) => {
            state.access = action.payload;
        },
        logout: (state) => {
            state.name = '';
            state.email = '';
            state.address = '';
            state.phoneNumber = '';
            state.neighborhood = '';
            state.access = '';
            state.refresh = '';
        },
    },
});

export const { login, logout, storeUserInformation, setAccessToken} = authSlice.actions;

export const selectAuth = (state) => state.auth;