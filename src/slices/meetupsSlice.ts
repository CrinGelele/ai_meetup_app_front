import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { Meetup, Speaker } from '../modules/aimaApi'
import { api } from '../api'

interface Invite {
    speaker: Speaker;
    approx_perfomance_duration: number | null;
}

interface MeetupState {
    meetupData: Meetup;
    invites: Invite[]; // массив услуг
    error: string | null;
    isDraft: boolean;
}

const initialState: MeetupState = {
    invites: [],
    meetupData: {
        id: NaN,
        status: '',
        user: NaN,
        moderator: '',
        creation_date: null,
        submit_date: null,
        resolve_date: null,
        topic: '',
        meetup_date: null,
        viewers: ''
    },
    error: null,
    isDraft: false,
  };

  export const getMeetup = createAsyncThunk(
    'meetup/getMeetup',
    async (current_meetup_id: string) => {
      const response = await api.meetups.getSingleMeetup(current_meetup_id);
      return response.data;
    }
  );

  export const inviteSpeaker = createAsyncThunk(
    'speakers/inviteSpeaker',
    async (id: string) => {
      const response = await api.speakers.inviteSingleSpeaker(id);
      return response.data;
    }
  );

  export const deleteMeetup = createAsyncThunk(
    'meetup/deleteMeetup',
    async (current_meetup_id: string) => {
      const response = await api.meetups.deleteSingleMeetup(current_meetup_id);
      return response.data;
    }
  );

  export const commitMeetup = createAsyncThunk(
    'meetup/commitMeetup',
    async (current_meetup_id: string) => {
      const response = await api.meetups.submitMeetup(current_meetup_id);
      return response.data;
    }
  );

  export const updateMeetup = createAsyncThunk(
    'meetup/updateMeetup',
    async ({ current_meetup_id, meetupData }: { current_meetup_id: string; meetupData: Meetup }) => {
      const meetupDataToSend = {
        status: meetupData.status,
        user: meetupData.user,
        topic: meetupData.topic ?? '', 
        meetup_date: meetupData.meetup_date instanceof Date 
        ? meetupData.meetup_date.toISOString() // Преобразуем Date в строку
        : meetupData.meetup_date, // Оставляем как есть, если это строка
      };
      const response = await api.meetups.changeSingleMeetup(current_meetup_id, meetupDataToSend);
      return response.data;
    }
  );

  export const deleteInvite = createAsyncThunk(
    'cities/deleteInvite',
    async ({ current_meetup_id, speaker_id }: { current_meetup_id: string; speaker_id: number }) => {
      await api.invites.deleteSingleInvite(
        current_meetup_id.toString(),
        speaker_id.toString()
      ); 
    }
  );

  export const updateInvite = createAsyncThunk(
    'cities/updateInvite',
    async ({ current_meetup_id, speaker_id, inviteData }: { current_meetup_id: string; speaker_id: number; inviteData: Invite }) => {
        const inviteDataToSend = {
            speaker: inviteData.speaker,
            approx_perfomance_duration: inviteData.approx_perfomance_duration
          }
      await api.invites.changeSingleInvite(
        current_meetup_id.toString(),
        speaker_id.toString(),
        inviteDataToSend,
      ); 
    }
  );

  const meetupSlice = createSlice({
    name: 'Meetup',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.error = action.payload;
        },
        setMeetupData: (state, action) => {
            state.meetupData = {
                ...state.meetupData,
                ...action.payload,
            };
        },
        setInvites: (state, action) => {
            state.invites = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMeetup.fulfilled, (state, action) => {
                state.meetupData = action.payload.meetup; // Сохраняем данные из API
                state.invites = action.payload.speakers; // Сохраняем данные из API
                state.isDraft = state.meetupData.status == "Черновик";
            })
            .addCase(getMeetup.rejected, (state, action) => {
                state.error = action.error.message || 'Ошибка при загрузке данных';
              })
          .addCase(deleteMeetup.fulfilled, (state) => {
            state.invites = [];
            state.meetupData = {
                id: NaN,
                status: '',
                user: NaN,
                moderator: '',
                creation_date: null,
                submit_date: null,
                resolve_date: null,
                topic: '',
                meetup_date: null,
                viewers: ''
            }
          })
          .addCase(deleteMeetup.rejected, (state) => {
            state.error = 'Ошибка при удалении вакансии';
          })
          .addCase(updateMeetup.fulfilled, (state, action) => {
            state.meetupData = action.payload.meetup; // Сохраняем данные из API
            state.invites = action.payload.speakers; // Сохраняем данные из API
            state.isDraft = state.meetupData.status == "Черновик";
          })
          .addCase(updateMeetup.rejected, (state) => {
            state.error = 'Ошибка при обновлении данных';
          })
          .addCase(commitMeetup.fulfilled, (state) => {
            state.invites = [];
            state.meetupData = {
                id: NaN,
                status: '',
                user: NaN,
                moderator: '',
                creation_date: null,
                submit_date: null,
                resolve_date: null,
                topic: '',
                meetup_date: null,
                viewers: ''
            }
          })
          .addCase(commitMeetup.rejected, (state) => {
            state.error = 'Ошибка при удалении вакансии';
          })
          .addCase(updateInvite.rejected, (state) => {
            state.error = 'Ошибка при обновлении данных';
          })
      }
    });
  
  export const { setError, setMeetupData, setInvites } = meetupSlice.actions;
  export const meetupsReducer = meetupSlice.reducer;
  //export default vacancyApplicationDraftSlice.reducer;