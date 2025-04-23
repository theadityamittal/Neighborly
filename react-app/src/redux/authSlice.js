// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  address: '',
  phoneNumber: '',
  neighborhood: '',
  accountType: '',     // ← new
  access: '',
  refresh: '',
  user_id: '',
  verified: false,
  is_staff: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.access  = action.payload.access;
      state.refresh = action.payload.refresh;
    },
    storeUserInformation: (state, action) => {
      // destructure exactly the fields our DRF serializer returns
      const {
        name,
        email,
        address,
        phone_number,
        neighborhood,
        account_type,
        verified,
        user_id,
        is_staff,
      } = action.payload;

      state.name         = name;
      state.email        = email;
      state.address      = address;
      state.phoneNumber  = phone_number;
      state.neighborhood = neighborhood;
      state.accountType  = account_type;   // ← map account_type
      state.verified     = verified;
      state.user_id      = user_id
      state.is_staff     = is_staff;
    },
    setAccessToken: (state, action) => {
      state.access = action.payload;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  login,
  logout,
  storeUserInformation,
  setAccessToken
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
