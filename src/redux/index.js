import { configureStore } from '@reduxjs/toolkit';
import { weatherApi } from './services/weatherApi';
import { cityApi } from './services/cityApi';
import { latitudeAndLongitudeApi } from './services/latitudeAndLongitudeApi';
import weatherReducer from './slices/weatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [latitudeAndLongitudeApi.reducerPath]: latitudeAndLongitudeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(cityApi.middleware)
    .concat(weatherApi.middleware)
    .concat(latitudeAndLongitudeApi.middleware),
});