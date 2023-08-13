import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {DateReview} from "../components/recording_date/DateReview";

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://api.bellwetherinsight.com',
    // baseUrl: 'http://10.0.0.197:3001'
    baseUrl: 'http://localhost:3001/api',
  }),
  tagTypes: ['USER', 'ROOM', 'DATE', 'MESSAGE'],
  endpoints: (builder) => ({

    /* ============= BEGIN USER ROUTES ============== */
    getUser: builder.query<User, string>({
      // TODO -- will get this from AWS data
      query: (cognitoId: string)=> ({
        url: `get-user/${cognitoId}`,
        method: 'GET',
      }),
      providesTags: ['USER']
    }),

    createUser: builder.mutation<any, User>({
      query: (user: User) => ({
        url: `create-user`,
        method: 'POST',
        body: user
      }),
      invalidatesTags: ['USER']
    }),

    unlockUser: builder.mutation<any, string>({
      query: (cognitoId: string) => ({
        url: 'unlock',
        method: 'POST',
        body: {cognitoId}
      }),
      invalidatesTags: ['USER']
    }),

    readyJoinRoom: builder.mutation<any, string>({
      query: (cognitoId: string) => ({
        url: 'ready-join-room',
        method: 'POST',
        body: {cognitoId}
      }),
      invalidatesTags: ['USER']
    }),
    /* ============= END USER ROUTES ============== */

    /* ============= BEGIN ROOM ROUTES ============== */
    getRoom: builder.query<{room: Room, dates: Date[]}, string>({
      query: (cognitoId: string)=> ({
        url: `display-room/${cognitoId}`,
        method: 'GET',
      }),
      providesTags: ['ROOM', 'DATE']
    }),

    formRoom: builder.mutation<any, string>({
      query: (cognitoId: string) => ({
        url: 'form-room',
        method: 'POST',
        body: {cognitoId: cognitoId}
      }),
      invalidatesTags: (result) => result ? ['ROOM', 'USER'] : [],
    }),
    /* ============= END ROOM ROUTES ============== */

    /* ============= BEGIN CONVERSATION ROUTES ============== */
    getMessages: builder.query<Message[], {cognitoId: string, otherUserId: string}>({
      query: ({cognitoId, otherUserId})=> ({
        url: `get-messages/${cognitoId}/${otherUserId}`,
        method: 'GET',
      }),
      providesTags: ['MESSAGE']
    }),

    postMessage: builder.mutation<any, { cognitoId: string, conversationId?: string, otherUserId?: string, text?: string, isImage: boolean, imageUrl?: string }>({
      query: (body) => ({
        url: 'post-message',
        method: 'POST',
        body
      }),
      invalidatesTags: ['MESSAGE']
    }),
    /* ============= END CONVERSATION ROUTES ============== */

    /* ============= BEGIN DATE ROUTES ============== */
    proposeDate: builder.mutation<any, {cognitoId: string, otherUserId: string, time: number}>({
      query: (body) => ({
        url: 'propose-date',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE']
    }),

    proposeSetup: builder.mutation<any, {cognitoId: string, otherUserId: string, time: number}>({
      query: (body) => ({
        url: 'propose-setup',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE']
    }),

    acceptDate: builder.mutation<any, {cognitoId: string, dateId: string}>({
      query: (body) => ({
        url: 'accept-date',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE', 'USER']
    }),

    acceptSetup: builder.mutation<any, {cognitoId: string, dateId: string}>({
      query: (body) => ({
        url: 'accept-setup',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE', 'USER']
    }),

    rejectDate: builder.mutation<any, {cognitoId: string, dateId: string}>({
      query: (body) => ({
        url: 'reject-date',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE']
    }),

    reviewDate: builder.mutation<any, {cognitoId: string, review: DateReview}>({
      query: (body) => ({
        url: 'review-date',
        method: 'POST',
        body: {cognitoId: body.cognitoId, ...body.review}
      }),
      invalidatesTags: ['USER']
    })
    /* ============= END DATE ROUTES ============== */

  }),
})

export const {
    // user information
    useGetUserQuery,
    useCreateUserMutation,
    useUnlockUserMutation,
    useReadyJoinRoomMutation,

    // room information
    useGetRoomQuery,
    useFormRoomMutation,

    // message information
    useGetMessagesQuery,
    usePostMessageMutation,

    // date information
    useProposeDateMutation,
    useProposeSetupMutation,
    useAcceptDateMutation,
    useAcceptSetupMutation,
    useRejectDateMutation,
    useReviewDateMutation
} = api
