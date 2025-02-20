import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Speaker } from '../modules/aimaApi';
import { api } from '../api'; // Импортируем API
import { SPEAKERS_MOCK } from '../modules/mock';

interface SpeakersData {
  current_meetup_id: number | null;
  speakers_quantity: string | null;
  speakers: Speaker[];
}

interface SpeakersState {
  searchValue: string;
  speakersData: SpeakersData;
  loading: boolean;
}

const initialState: SpeakersState = {
  searchValue: '',
  speakersData: {
    current_meetup_id: null,
    speakers_quantity: null,
    speakers: [],
  },
  loading: false,
};

// Асинхронный экшен для загрузки списка спикеров
export const getSpeakersList = createAsyncThunk(
  'speakers/getSpeakersList',
  async (_, { getState, rejectWithValue }) => {
    const { speakers }: any = getState();
    const timeout = 5000;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Запрос превысил время ожидания'));
        }, timeout);
      });
      const response = await Promise.race([
        await api.speakers.readSpeakersList({ speaker_name_to_find: speakers.searchValue }),
        timeoutPromise,
      ]);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

// Асинхронный экшен для обновления спикера
export const updateSpeaker = createAsyncThunk(
  'speakers/updateSpeaker',
  async ({ speakerId, data }: { speakerId: string; data: Speaker }, { rejectWithValue }) => {
    try {
      const response = await api.speakers.editSingleSpeaker(speakerId, data);
      return response.data; // Возвращаем только данные, без заголовков
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении спикера');
    }
  }
);

export const addSpeaker = createAsyncThunk(
  'speakers/addSpeaker',
  async (data: Speaker, { rejectWithValue }) => {
    try {
      const response = await api.speakers.createSpeaker(data); // Предположим, что API поддерживает создание
      return response.data; // Возвращаем данные нового спикера
    } catch (error) {
      return rejectWithValue('Ошибка при добавлении спикера');
    }
  }
);

export const deleteSpeaker = createAsyncThunk(
  'speakers/deleteSpeaker',
  async (speakerId: string, { rejectWithValue }) => {
    try {
      await api.speakers.deleteSingleSpeaker(speakerId); // Предположим, что API поддерживает удаление
      return speakerId; // Возвращаем ID удаленного спикера
    } catch (error) {
      return rejectWithValue('Ошибка при удалении спикера');
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
        state.speakersData = action.payload;
      })
      .addCase(getSpeakersList.rejected, (state) => {
        state.loading = false;
        state.speakersData.current_meetup_id = null;
        state.speakersData.speakers_quantity = null;
        state.speakersData.speakers = SPEAKERS_MOCK.speakers.filter((item) =>
          item.last_name.toLocaleLowerCase().startsWith(state.searchValue.toLocaleLowerCase())
        );
      })
      .addCase(addSpeaker.fulfilled, (state, action) => {
        state.speakersData.speakers.push(action.payload); // Добавляем нового спикера в список
      })
      .addCase(deleteSpeaker.fulfilled, (state, action) => {
        const speakerId = action.payload;
        state.speakersData.speakers = state.speakersData.speakers.filter(
          (speaker) => String(speaker.id) !== speakerId
        ); // Удаляем спикера из списка
      })
      .addCase(updateSpeaker.fulfilled, (state, action) => {
        const updatedSpeaker = action.payload;
        state.speakersData.speakers = state.speakersData.speakers.map((speaker) =>
          speaker.id === updatedSpeaker.id ? updatedSpeaker : speaker
        );
      });
  },
});

export const { setSearchValue } = speakersSlice.actions;
export const selectSearchValue = (state: { filter: SpeakersState }) => state.filter.searchValue;
export const speakersReducer = speakersSlice.reducer;