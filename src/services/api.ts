import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://api.bellwetherinsight.com',
    // baseUrl: 'http://10.0.0.197:3001'
    baseUrl: 'http://localhost:3001/api',
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation<any, User>({
      query: (user: User) => ({
        url: `create-user`,
        method: 'POST',
        body: user
      })
    }),

    formRoom: builder.mutation<any, string>({
      query: (userId: string) => ({
        url: 'form-room',
        method: 'POST',
        body: {userId: userId}
      })
    }),

    getUser: builder.query<User, string>({
      // TODO -- will get this from AWS data
      query: (cognitoId: string)=> ({
        url: 'get-user',
        method: 'GET',
        body: {cognitoId}
      })
    }),

    getRoom: builder.query<{room: Room, dates: [Date]}, string>({
      query: (cognitoId: string)=> ({
        url: 'display-room',
        method: 'GET',
        body: {cognitoId}
      })
    })
  }),
})

export const {
  useCreateUserMutation,
  useFormRoomMutation,
  useGetUserQuery,
  useGetRoomQuery
} = api
