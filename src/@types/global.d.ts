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
  location: UserLocation
  photoLinks: string[]
  priorityMode: boolean
  priorityModeExpiryTime?: string
  profileComplete: boolean

  // preferences
  lookingFor: string[]
  shortTerm: boolean
  ageRange: AgeRange

  // dating history
  waitingForRoom: boolean
  currentRoom?: string

  temporarilyLocked: boolean
  unlockTime?: string
  mustReviewDate: boolean
  lockingDate?: PopulatedDate
  freeSwaps?: number
}

declare interface UserMini {
  _id: string
  firstName: string
  identity: string
  age: number
  photoLinks: string[]
  shortTerm: boolean
  distance?: number
}

declare interface UserLocation {
  type: 'Point'
  coordinates: [number, number]// longitude, latitude
}

declare interface AgeRange {
  min: number
  max: number
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

declare interface DateReview {
  reviewee: string
  dateObject: string
  wasNoShow: boolean
  wasCatfish: boolean
  wasThreatening: boolean
  intelligent: number
  trustworthy: number
  attractive: number
  pleasant: number
  satisfied: number
  secondDate: boolean
}

declare interface Message {
  text: string
  isImage: boolean
  imageUrl: string
  conversation: string
  createdAt: number
  sender: string
}

declare interface Conversation {
  users: [string]
  user0Read: boolean
  user1Read: boolean
}