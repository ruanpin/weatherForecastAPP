import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.open-meteo.com/v1/' }),
  endpoints: (builder) => ({
    getCityWeatherCurrent: builder.query({
      query: ({latitude, longitude}) => `forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
    }),
  }),
});

export const { useLazyGetCityWeatherCurrentQuery } = weatherApi;