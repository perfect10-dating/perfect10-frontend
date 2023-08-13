import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://api.bellwetherinsight.com',
    // baseUrl: 'http://10.0.0.197:3001'
    baseUrl: 'http://localhost:3001/api',
  }),
  endpoints: (builder) => ({

    /* ============= BEGIN USER ROUTES ============== */
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
        url: `get-user/${cognitoId}`,
        method: 'GET',
      })
    }),

    getRoom: builder.query<{room: Room, dates: Date[]}, string>({
      query: (cognitoId: string)=> ({
        url: `display-room/${cognitoId}`,
        method: 'GET',
      })
    }),
    /* ============= END USER ROUTES ============== */

    /* ============= BEGIN CONVERSATION ROUTES ============== */
    getMessages: builder.query<Message[], {cognitoId: string, otherUserId: string}>({
      query: ({cognitoId, otherUserId})=> ({
        url: `get-messages/${cognitoId}/${otherUserId}`,
        method: 'GET',
      })
    }),

    postMessage: builder.mutation<any, { cognitoId: string, conversationId?: string, otherUserId?: string, text?: string, isImage: boolean, imageUrl?: string }>({
      query: (body) => ({
        url: 'post-message',
        method: 'POST',
        body
      })
    }),
  }),
})

export const {
  // user information
  useCreateUserMutation,
  useFormRoomMutation,
  useGetUserQuery,
  useGetRoomQuery,

  // message information
  useGetMessagesQuery,
  usePostMessageMutation

} = api
