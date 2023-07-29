declare module 'react-youtube'
// #BEGIN BUSINESS LOGIC

declare interface User {
  cognitoId: string
  phoneNumber: string
  emailAddress?: string
  firstName: string
  identity: string
  age: number
  dateOfBirth: number  // time since 1970 (SIGNED)
  locationCoords: [number, number]  // longitude, latitude
  lookingFor: [string]
  ageRange: {minAge: number, maxAge: number}
}

declare interface Image {
  url?: string
  attribution?: string
}

declare interface Choice {
  label: string
  value: number
  image?: Image
}

declare interface Question {
  _id?: string
  creator?: string
  type: string | 'boolean' | 'multiple-choice' | 'image-choice' | 'rank' | 'image-rank' | 'rate' | 'text'
  prompt: string
  image?: Image
  choices: Choice[]
}

declare interface Survey {
  _id?: string
  surveyType: string
  linkAccess: string
  creator: string
  name: string
  questions: Question[]
  url: string[]
  customId?: string
  navbarImageUrl?: string
  desktopImageUrl?: string
  navbarColor?: string
  backgroundColor?: string
  background?: string
  paidForBy?: string
  active: boolean
  previewMode: boolean
  anonymousVoting?: AnonymousVoting
  callToAction?: CallToAction
  earlyExits?: any // map of questionId -> choice values that trigger the early exit
  creatorInfo: any
}

declare interface DonateCTA {
  backgroundColor: string
  backgroundImage: string // the url of the fullscreen background image
  image: string // the url of the image on the donation card
  text: string // the main call-to-action text - can be relatively longform, and supports raw html
  donationAmounts: number[] // the donation amounts for which to render donation buttons
  buttonUrl: string // url of the donation page, to which ?amount={amount} is appended for each donation button (one donation button is rendered for each amount in the donationAmounts array above)
  buttonColor: string // the color (css background-color) of the donation buttons
}

declare interface CardCTA {
  backgroundImage: string // the url of the fullscreen background image
  image: string // url of hte image on the card
  text: string // the main call-to-action text - can be relatively longform
  buttonLabel: string // cta button text - must be short
  buttonUrl: string // the url to open when the cta button is clicked
  buttonColor: string // the color (css background-color) of the cta button
}

declare interface FormCTA {
  backgroundColor: string
  backgroundImage: string // the url of the fullscreen background image
  image: string // the url of the image above the form
  text: string // the call-to-action text above the form - can be relatively longform, and supports raw html
  feedback: string // text to display after a respondent has submitted the form, eg. 'Thank you for getting in touch', etc.
  button: {
    backgroundColor: string // the css background-color of the form submission button
    color: string // the css color of the form submission button
    text: string // the text on the form submission button
  }
  inputs: [
    {
      displayName: string // the label for the input field
      name: string // the unique name of the input field
      required: boolean // whether the input field is required
      inputType: string // supports 'email', 'phone', 'paragraph' and empty (for short text, the default type). email and phone input will be validated client-side.
    }
  ]
  legal?: string // legal disclaimers etc
}

declare interface CallToAction {
  // describes a call to action
  type: string // supported values: 'default', 'card', 'redirect', 'iframe', 'html'
  donate: DonateCTA
  card: CardCTA
  form: FormCTA
  redirect: string // redirect url. TODO: refactor into type
  iframe: string // iframe src url. TODO: refactor into type
  html: string // stringified freeform html. TODO: refactor into type
}

declare interface Vote {
  voter?: {
    ip: string
    device: string
    person?: Person
  }
  survey: any
  question: any
  choice: { label: string; value: number }[]
  utm?: string
}

declare interface SurveyInteraction {
  voter?: {
    ip: string
    device: string
    person?: Person
  }
  survey: any
  type: 'view' | 'start' | 'completion' | 'cta-click' | 'cta-submit' | 'share'
  data?: any
  utm?: string
}

declare interface AnonymousVoting {
  // voting without requiring authentication
  enabled: boolean
  counts: {
    view: number // how many times the survey link was opened
    start: number // how many times the first question in the survey was voted on
    completion: number // how many times every question in the survey was voted on
    ctaClick: number // how many times the call-to-action button at the end of the survey was clicked. if CTA branching is enabled, clicks on both CTAs increment this  tally
    formSubmission: number // how many times a form call-to-action has been submitted
    share: number // how many times any of the sharing buttons were clicked

    // BEGIN branched CTA metrics
    primaryCTAImpression: number // how many times the primary CTA was shown
    primaryCTAClick: number // how many times the primary CTA was clicked
    alternateCTAImpression: number // how many times the alternate CTA was shown
    alternateCTAClick: number // how many times the alternate CTA was clicked
    // END branched CTA metrics
  }
}
// #END BUSINESS LOGIC

// #BEGIN RENDER LOGIC
declare interface MetricBar {
  width: number
}

declare interface Selectable {
  selected: boolean
}

declare interface Slidable {
  value: number
}
// #END RENDER LOGIC
