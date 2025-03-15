import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCity: '',
  citysLatitudeLongitude: {
    latitude: 0,
    longitude: 0
  },
  isSearchProcessing_current: false,
  isSearchProcessing_forecast: false,
  isError: false,
  errorMsg: ''
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
    },
    setErrorMsg: (state, action) => {
      state.isError = action.payload.isError;
      state.errorMsg = action.payload.errorMsg;
    }
  }
});

export const { setSelectedCity, setLatitudeLongitude, setIsSearchProcessing_current, setIsSearchProcessing_forecast, setErrorMsg } = weatherSlice.actions;
export default weatherSlice.reducer; 