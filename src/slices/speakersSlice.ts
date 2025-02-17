import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { Speaker } from '../modules/aimaApi'
import { api } from '../api'
import { SPEAKERS_MOCK } from '../modules/mock';

interface SpeakersData {
    current_meetup_id: number | null;
    speakers_quantity: string | null;
    speakers: Speaker[];
  }

interface SpeakersState {
    searchValue: string;
    speakersData: SpeakersData
    loading: boolean;
}

const initialState: SpeakersState = {
    searchValue: '', // Поле для поиска (если нужно)
    speakersData: {
        current_meetup_id: null,
        speakers_quantity: null,
        speakers: [], // Инициализируем пустым массивом
      },// Данные, возвращаемые API
    loading: false
  };

export const getSpeakersList = createAsyncThunk(
    'speakers/getSpeakersList',
    async (_, { getState, dispatch, rejectWithValue }) => {
      const { speakers }: any = getState();
      try {
        const response = await api.speakers.readSpeakersList({speaker_name_to_find: speakers.searchValue});
        return response.data;
      } catch (error) {
        return rejectWithValue('Ошибка при загрузке данных');
      }
    }
  );

const speakersSlice = createSlice({
    name: 'speakers',
    initialState,
    reducers: {
        setSearchValue(state, action) {
            state.searchValue = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(getSpeakersList.pending, (state) => {
            state.loading = true;
          })
          .addCase(getSpeakersList.fulfilled, (state, action) => {
            state.loading = false;
            state.speakersData = action.payload; // Сохраняем данные из API
          })
          .addCase(getSpeakersList.rejected, (state) => {
            state.loading = false;
            state.speakersData.current_meetup_id = null;
            state.speakersData.speakers_quantity = null;
            state.speakersData.speakers = SPEAKERS_MOCK.speakers.filter((item) =>
              item.last_name.toLocaleLowerCase().startsWith(state.searchValue.toLocaleLowerCase())
            );
          });
      },
});

export const {setSearchValue} = speakersSlice.actions;
export const selectSearchValue = (state: { filter: SpeakersState }) => state.filter.searchValue;
export const speakersReducer = speakersSlice.reducer;