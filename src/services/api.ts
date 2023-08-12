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

    getUser: builder.query<any, string>({
      // TODO -- will get this from AWS data
      query: (cognitoId: string)=> ({
        url: 'get-user',
        method: 'GET',
        body: {cognitoId}
      })
    }),

    getSurvey: builder.query<any, string>({
      query: (mask) => ({
        url: `survey/${mask}`,
        method: 'GET',
      }),
    }),

    postVote: builder.mutation<void, Vote>({
      query: (vote) => ({
        url: `vote/`,
        method: 'POST',
        body: vote,
      }),
    }),

    postSurveyInteraction: builder.mutation<void, SurveyInteraction>({
      query: (surveyInteraction) => ({
        url: `surveyInteraction/`,
        method: 'POST',
        body: surveyInteraction,
      }),
    }),

    putSurveyMask: builder.mutation({
      query: ({ _id, delta }) => ({
        url: `surveyMask/${_id}`,
        method: 'PUT',
        body: delta,
      }),
    }),
  }),
})

export const {
  useCreateUserMutation,
  useFormRoomMutation,
  useGetUserQuery,
} = api
