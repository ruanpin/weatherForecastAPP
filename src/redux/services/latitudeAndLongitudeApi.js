import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const latitudeAndLongitudeApi = createApi({
  reducerPath: 'latitudeAndLongitudeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://nominatim.openstreetmap.org/' }),
  endpoints: (builder) => ({
    getLatitudeLongitude: builder.query({
      query: (city) => `search?format=json&q=${city}`,
    }),
  }),
});

export const { useLazyGetLatitudeLongitudeQuery } = latitudeAndLongitudeApi;