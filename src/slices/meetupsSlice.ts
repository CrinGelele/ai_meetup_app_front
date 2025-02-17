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
}

const initialState: MeetupState = {
    id: NaN,
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
    async (id: number) => {
      const response = await api.speakers.inviteSingleSpeaker(id.toString());
      return response.data;
    }
  );

  const meetupSlice = createSlice({
    name: 'Meetup',
    initialState,
    reducers: {
        setAppId: (state, action) => {
            state.id = action.payload;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMeetup.fulfilled, (state, action) => {
                state.meetupData = action.payload.meetup; // Сохраняем данные из API
                state.invites = action.payload.speakers; // Сохраняем данные из API
            })
          .addCase(getMeetup.rejected, (state) => {
            state.error = 'Ошибка при загрузке данных';
          });
      }
    });
  
  export const { setAppId } = meetupSlice.actions;
  export const meetupsReducer = meetupSlice.reducer;
  //export default vacancyApplicationDraftSlice.reducer;