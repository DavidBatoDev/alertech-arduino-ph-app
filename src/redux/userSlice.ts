// userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, RegularUser, NeighborUser } from './userTypes'; // Adjust import path

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // For regular user
    setRegularUser: (state, action: PayloadAction<RegularUser>) => {
      state.user = action.payload;           // user is now a RegularUser
      state.isAuthenticated = true;
      state.error = null;
    },
    // For neighbor user
    setNeighborUser: (state, action: PayloadAction<NeighborUser>) => {
      state.user = action.payload;           // user is now a NeighborUser
      state.isAuthenticated = true;
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRegularUser,
  setNeighborUser,
  logout,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
