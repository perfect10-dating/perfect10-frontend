declare module 'react-youtube'
// #BEGIN BUSINESS LOGIC

declare interface User {
  _id: string
  cognitoId: string
  phoneNumber: string
  emailAddress?: string
  firstName: string
  lastName?: string
  identity: string
  age: number
  dateOfBirth: number  // time since 1970 (SIGNED)
  locationCoords: [number, number]  // longitude, latitude
  photoLinks: string[]

  // preferences
  lookingFor: string[]
  shortTerm: boolean
  ageRange: {min: number, max: number}

  // dating history
  waitingForRoom: boolean
  currentRoom?: string

  temporarilyLocked: boolean
  unlockTime?: string
  mustReviewDate: boolean
  lockingDate?: PopulatedDate
}

declare interface UserMini {
  _id: string
  firstName: string
  identity: string
  age: number
  location: {coordinates: [number, number]}  // longitude, latitude
}

declare interface Room {
  sideOne: UserMini[]
  sideOneIdentity: string
  sideTwo: UserMini[]
  sideTwoIdentity: string
}

declare interface Date {
  _id: string
  isSetup: boolean
  proposer: string
  isAccepted: boolean
  users: string[]
  setupResponsibleUser?: string
  time: string // (new Date(date.time)).getTime()
}

declare interface PopulatedDate extends Date{
  setupResponsibleUser?: UserMini
  users: UserMini[]
}

declare interface Message {
  text: string,
  isImage: boolean,
  imageUrl: string,
  conversation: string
  createdAt: number,
  sender: string,
}

declare interface Conversation {
  users: [string],
}