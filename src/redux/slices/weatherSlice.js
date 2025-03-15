import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  citysLatitudeLongitude: {
    latitude: null,
    longitude: null
  },
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setLatitudeLongitude: (state, action) => {
      state.citysLatitudeLongitude = action.payload;
    }
  }
});

export const { setLatitudeLongitude } = weatherSlice.actions;
export default weatherSlice.reducer; 