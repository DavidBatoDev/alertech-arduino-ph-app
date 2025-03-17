// userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email?: string;
  type?: 'user' | 'neighbor';     // <--- ADDED
  // Neighbor-specific fields:
  address?: string;
  contact?: string;
  description?: string;
  fireStationUUID?: string;
}

// Define the initial state type
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
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
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

    // 1) Add a reducer to store neighbor data
    setNeighborData: (state, action: PayloadAction<Partial<User>>) => {
      // If there's no user yet, create a placeholder
      if (!state.user) {
        state.user = {
          id: '',
          username: '',
          type: 'neighbor',
        };
      }
      // Merge neighbor fields and ensure type is 'neighbor'
      state.user = {
        ...state.user,
        ...action.payload,
        type: 'neighbor',
      };
    },
  },
});

export const {
  login,
  logout,
  setLoading,
  setError,
  setNeighborData, // <--- Export your new action
} = userSlice.actions;

export default userSlice.reducer;
