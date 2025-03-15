import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.open-meteo.com/v1/' }),
  endpoints: (builder) => ({
    getCityWeatherCurrent: builder.query({
      query: ({ latitude, longitude, params = '' }) => `forecast?latitude=${latitude}&longitude=${longitude}${params}`,
    }),
  }),
});

export const { useLazyGetCityWeatherCurrentQuery } = weatherApi;