import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cityApi = createApi({
  reducerPath: 'cityApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://geocoding-api.open-meteo.com/v1/' }),
  endpoints: (builder) => ({
    searchCity: builder.query({
      query: (city) => `search?name=${city}&count=5&language=en&format=json`,
    }),
  }),
});

export const { useLazySearchCityQuery } = cityApi;