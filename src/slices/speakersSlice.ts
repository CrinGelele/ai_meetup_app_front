import {createSlice} from '@reduxjs/toolkit'
import { Speaker } from '../modules/aimaApi'

interface SpeakersState {
    searchValue: string;
    speakers: Speaker[];
    loading: boolean;
}

const initialState: SpeakersState = {
    searchValue: '',
    speakers: [],
    loading: false,
};

const speakersSlice = createSlice({
    name: 'speakers',
    initialState,
    reducers: {
        setSearchValue(state, action) {
            state.searchValue = action.payload;
        },
    },
});

export const {setSearchValue} = speakersSlice.actions;
export const selectSearchValue = (state: { filter: SpeakersState }) => state.filter.searchValue;
export default speakersSlice.reducer;