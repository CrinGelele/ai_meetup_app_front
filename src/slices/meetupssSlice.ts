import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { Meetup } from '../modules/aimaApi'
import { api } from '../api'

interface MeetupsState {
    meetups: Meetup[];
    error: string | null;
}
  
const initialState: MeetupsState = {
    meetups: [],
    error: null
};

export const getMeetups = createAsyncThunk(
    'meetup/getMeetups',
    async () => {
        const response = await api.meetups.getMeetupsList();
        return response.data;
    }
);

export const getMeetupsFiltered = createAsyncThunk(
    'meetup/getMeetupsFiltered',
    async ({ start, end, status }: { start: string; end: string; status: string }) => {
        const response = await api.meetups.getMeetupsList({ start: start, end: end, status: status });
        return response.data;
    }
);

export const moderateMeetup = createAsyncThunk(
    'meetup/moderateMeetup',
    async ({ meetup_id, status }: { meetup_id: string; status: string }) => {
      const response = await api.meetups.moderateMeetup(meetup_id, {status: status});
      return response.data;
    }
  );

const meetupsSlice = createSlice({
    name: 'Meetups',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.error = action.payload;
        },
        setMeetupsData: (state, action) => {
            state.meetups = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMeetups.fulfilled, (state, action) => {
                state.meetups = action.payload; // Сохраняем данные из API
            })
            .addCase(getMeetups.rejected, (state, action) => {
                state.error = action.error.message || 'Ошибка при загрузке данных';
            })
            .addCase(getMeetupsFiltered.fulfilled, (state, action) => {
                state.meetups = action.payload; // Сохраняем данные из API
            })
            .addCase(getMeetupsFiltered.rejected, (state, action) => {
                state.error = action.error.message || 'Ошибка при загрузке данных';
            })
    }
    });
  
  export const { setError, setMeetupsData } = meetupsSlice.actions;
  export const meetupssReducer = meetupsSlice.reducer;