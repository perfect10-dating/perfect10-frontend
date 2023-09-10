import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {DateReview} from "../components/recording_date/DateReview";
import {RootState} from "../app/store";
import currentApp from "../appConfiguration";

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://api.bellwetherinsight.com',
    // baseUrl: 'http://10.0.0.197:3001'
    baseUrl: currentApp.baseApiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.jwtToken
      console.log("Token is:")
      console.log(token)
      headers.set('id-token', token)
      return headers
    },
  }),
  tagTypes: ['USER', 'ROOM', 'DATE', 'MESSAGE', 'CONVERSATION'],
  endpoints: (builder) => ({

    /* ============= BEGIN USER ROUTES ============== */
    getUser: builder.query<User, void>({
      // TODO -- will get this from AWS data
      query: ()=> ({
        url: `get-user`,
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

    editUser: builder.mutation<any, { lookingFor?: string[]; ageRange?: AgeRange;
      photoLinks?: string[], shortTerm?: boolean, location?: UserLocation }>({
      query: (body: { lookingFor?: string[]; ageRange?: AgeRange;
        photoLinks?: string[], shortTerm?: boolean, location?: UserLocation }) => ({
        url: `edit-user`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['USER']
    }),

    unlockUser: builder.mutation<any, void>({
      query: () => ({
        url: 'unlock',
        method: 'POST',
        body: {}
      }),
      invalidatesTags: ['USER']
    }),

    readyJoinRoom: builder.mutation<any, void>({
      query: () => ({
        url: 'ready-join-room',
        method: 'POST',
        body: {}
      }),
      invalidatesTags: ['USER']
    }),

    switchRoomsDelayed: builder.mutation<any, void>({
      query: () => ({
        url: 'switch-rooms-delayed',
        method: 'POST',
        body: {}
      }),
      invalidatesTags: ['USER', 'ROOM']
    }),

    doesPhoneNumberExist: builder.query<boolean, string>({
      query: (phoneNumber: string) => ({
        url: `does-phone-number-exist/${phoneNumber}`,
        method: 'GET'
      }),
    }),
    /* ============= END USER ROUTES ============== */

    /* ============= BEGIN ROOM ROUTES ============== */
    getRoom: builder.query<{room: Room, dates: Date[], conversations: Conversation[]}, void>({
      query: ()=> ({
        url: `display-room`,
        method: 'GET',
      }),
      providesTags: ['ROOM', 'DATE', 'CONVERSATION']
    }),

    formRoom: builder.mutation<any, void>({
      query: () => ({
        url: 'form-room',
        method: 'POST',
        body: {}
      }),
      invalidatesTags: (result) => result ? ['ROOM', 'USER'] : [],
    }),
    /* ============= END ROOM ROUTES ============== */

    /* ============= BEGIN CONVERSATION ROUTES ============== */
    getMessages: builder.query<Message[], {otherUserId: string}>({
      query: ({otherUserId})=> ({
        url: `get-messages/${otherUserId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        {type: "MESSAGE", id: arg.otherUserId}
      ],
    }),

    postMessage: builder.mutation<any, { conversationId?: string, otherUserId: string, text?: string, isImage: boolean, imageUrl?: string }>({
      query: (body) => ({
        url: 'post-message',
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, arg) => [
        {type: "MESSAGE", id: arg.otherUserId}
      ]
    }),
    /* ============= END CONVERSATION ROUTES ============== */

    /* ============= BEGIN DATE ROUTES ============== */
    proposeDate: builder.mutation<any, {otherUserId: string, time: number}>({
      query: (body) => ({
        url: 'propose-date',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE']
    }),

    proposeSetup: builder.mutation<any, {otherUserId: string, time: number}>({
      query: (body) => ({
        url: 'propose-setup',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE']
    }),

    acceptDate: builder.mutation<any, {dateId: string}>({
      query: (body) => ({
        url: 'accept-date',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE', 'USER']
    }),

    acceptSetup: builder.mutation<any, {dateId: string}>({
      query: (body) => ({
        url: 'accept-setup',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE', 'USER']
    }),

    rejectDate: builder.mutation<any, {dateId: string}>({
      query: (body) => ({
        url: 'reject-date',
        method: 'POST',
        body
      }),
      invalidatesTags: ['DATE']
    }),

    reviewDate: builder.mutation<any, {review: DateReview}>({
      query: (body) => ({
        url: 'review-date',
        method: 'POST',
        body: body.review
      }),
      invalidatesTags: ['USER']
    }),
    /* ============= END DATE ROUTES ============== */

    /* ============= BEGIN IMAGE ROUTES ============== */
    getS3SignedUrl: builder.mutation<{ signedRequest: string; resourceUrl: string }, void>({
      query: () => ({
        url: `s3-signed-url`,
        method: 'GET',
      }),
    }),
    /* ============= END IMAGE ROUTES ============== */

    /* ============= BEGIN LOGGING ROUTES ========== */
    logQrCode: builder.mutation<any, {qrCode: string}>({
      query: (body) => ({
        url: 'log-qr-code',
        method: 'POST',
        body: {qrCode: body.qrCode}
      }),
      invalidatesTags: []
    }),
    /* ============= END LOGGING ROUTES ============ */

  }),

})

export const {
    // user information
    useGetUserQuery,
    useCreateUserMutation,
    useEditUserMutation,
    useUnlockUserMutation,
    useReadyJoinRoomMutation,
    useSwitchRoomsDelayedMutation,
    useDoesPhoneNumberExistQuery,
    useLazyDoesPhoneNumberExistQuery,

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
    useReviewDateMutation,

    // image information
    useGetS3SignedUrlMutation,

    // logging
    useLogQrCodeMutation,
} = api
