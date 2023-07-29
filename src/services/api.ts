import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://api.bellwetherinsight.com',
    // baseUrl: 'http://10.0.0.197:3001'
    baseUrl: 'http://localhost:3001',
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation<any, User>({
      query: (user: User) => ({
        url: `create-user`,
        method: 'POST',
        body: user
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
  useGetSurveyQuery,
  usePostVoteMutation,
  usePostSurveyInteractionMutation,
  usePutSurveyMaskMutation,
} = api
