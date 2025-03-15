import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCity: '',
  citysLatitudeLongitude: {
    latitude: 0,
    longitude: 0
  },
  isSearchProcessing: false
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setLatitudeLongitude: (state, action) => {
      state.citysLatitudeLongitude = action.payload;
    },
    setIsSearchProcessing: (state, action) => {
      state.isSearchProcessing = action.payload;
    }
  }
});

export const { setSelectedCity, setLatitudeLongitude, setIsSearchProcessing } = weatherSlice.actions;
export default weatherSlice.reducer; 