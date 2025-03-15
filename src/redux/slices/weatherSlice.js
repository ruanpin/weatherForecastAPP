import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCity: '',
  citysLatitudeLongitude: {
    latitude: 0,
    longitude: 0
  },
  isSearchProcessing_current: false,
  isSearchProcessing_forecast: false
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
    setIsSearchProcessing_current: (state, action) => {
      state.isSearchProcessing_current = action.payload;
    },
    setIsSearchProcessing_forecast: (state, action) => {
      state.isSearchProcessing_forecast = action.payload;
    }
  }
});

export const { setSelectedCity, setLatitudeLongitude, setIsSearchProcessing_current, setIsSearchProcessing_forecast } = weatherSlice.actions;
export default weatherSlice.reducer; 