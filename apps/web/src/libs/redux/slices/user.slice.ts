import { TUser } from '@/models/user.model';
import { initialUser } from '../initial';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie } from 'cookies-next';

export const userSlice = createSlice({
  name: 'auth',
  initialState: initialUser as TUser | null,
  reducers: {
    login: (state, action: PayloadAction<TUser>) => {
      return { ...state, ...action.payload }; // return the new state directly
    },
    logout: (state) => {
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      return initialUser; // return initial state on logout
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
