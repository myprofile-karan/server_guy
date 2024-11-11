import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  password: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: null,
  password: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{username: string, password: string}>) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.username = null;
      state.password = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    clear: (state) => {
      state.username = null;
      state.password = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { login, logout, clear } = authSlice.actions;
export default authSlice.reducer;
