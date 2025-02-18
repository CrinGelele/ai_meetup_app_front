import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

interface UserState {
  userId: string;
  username: string;
  isModerator: boolean;
  isAuthenticated: boolean;
  error?: string | null; 
}

const initialState: UserState = {
  userId: '',
  username: '',
  isModerator: false,
  isAuthenticated: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.user.userUserCreate(credentials);
      return response.data; 
    } catch (error) {
      return rejectWithValue('Ошибка авторизации'); // Возвращаем ошибку в случае неудачи
    }
  }
);

// Асинхронное действие для авторизации
export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.login.loginCreate(credentials);
      return response.data; 
    } catch (error) {
      return rejectWithValue('Ошибка авторизации'); // Возвращаем ошибку в случае неудачи
    }
  }
);

// Асинхронное действие для деавторизации
export const logoutUserAsync = createAsyncThunk(
  'user/logoutUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.logout.logoutCreate();
      return response.data; 
    } catch (error) {
      return rejectWithValue('Ошибка при выходе из системы'); 
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        const { username, is_staff, userId } = action.payload;
        state.userId = userId ?? '';
        state.username = username;
        state.isModerator = is_staff ?? false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false; 
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.userId = '';
        state.username = '';
        state.isAuthenticated = false;
        state.isModerator = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.userId = '';
        state.username = '';
        state.isAuthenticated = false;
        state.isModerator = false;
        state.error = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });      
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;