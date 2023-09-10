import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, ISignUpResult } from 'amazon-cognito-identity-js'
import currentApp from "../appConfiguration";
import {getBirthDateString} from "../utils/getBirthDateString";

const userPool = new CognitoUserPool(currentApp.cognito)

export interface AuthState {
    authenticated: boolean
    existingUserError: boolean
    forgotPassword: boolean
    jwtToken: string
    loginPage: 'landing' | 'signUp' | 'signIn' | 'forgotPassword' | 'resetPassword'
    status: 'idle' | 'loading' | 'failed'
    recoveryNumber?: string
    phoneNumber?: string
    password?: string
}

const initialState: AuthState = {
    authenticated: false,
    existingUserError: false,
    forgotPassword: false,
    jwtToken: '',
    loginPage: 'landing',
    status: 'loading',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signInFlowStarted: (state) => {
            state.loginPage = 'signIn'
        },
        forgotPasswordFlowStarted: (state) => {
            state.loginPage = 'forgotPassword'
        },
        forgotPasswordEmailSent: (state) => {
            state.loginPage = 'resetPassword'
        },
        forgotPasswordFlowEnded: (state) => {
            state.loginPage = 'signIn'
        },
        signUpFlowStarted: (state) => {
            state.loginPage = 'signUp'
        },
        signUpFlowCanceled: (state) => {
            state.loginPage = 'signUp'
        },
        clearCredentials: (state) => {
            state.password = undefined
            state.phoneNumber = undefined
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncGetUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(asyncGetUser.fulfilled, (state, action) => {
                state.status = 'idle'
                state.authenticated = !!action.payload.jwtToken
                state.jwtToken = action.payload.jwtToken || ''
            })
            .addCase(asyncGetUser.rejected, (state) => {
                state.status = 'idle'
                state.authenticated = false
                state.jwtToken = ''
            })
            .addCase(asyncSignIn.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(asyncSignIn.fulfilled, (state, action) => {
                state.status = 'idle'
                state.authenticated = true
                state.jwtToken = action.payload.jwtToken || ''
                state.loginPage = 'signIn'
            })
            .addCase(asyncSignIn.rejected, (state) => {
                state.status = 'failed'
                state.loginPage = 'signIn'
            })
            .addCase(asyncSignUp.fulfilled, (state, action) => {
                state.phoneNumber = action.payload.phoneNumber
                state.password = action.payload.password
                // TODO -- confirm phone number
            })
            .addCase(asyncChangePassword.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(asyncChangePassword.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(asyncForgotPassword.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(asyncForgotPassword.fulfilled, (state, action) => {
                state.status = 'idle'
                state.forgotPassword = false
                state.phoneNumber = action.payload.phoneNumber
            })
            .addCase(asyncForgotPassword.rejected, (state) => {
                state.status = 'failed'
            })
            .addCase(asyncConfirmCodeUpdatePassword.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(asyncConfirmCodeUpdatePassword.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(asyncSignOut.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(asyncSignOut.fulfilled, (state, action) => {
                state.status = 'idle'
                state.authenticated = false
                state.jwtToken = ''
            })
    },
})

export const asyncGetUser = createAsyncThunk<{ jwtToken?: string; role?: string }>('auth/getUser', async () => {
    const { jwtToken, role } = await getUser()
    return { jwtToken, role }
})

export const asyncSignUp = createAsyncThunk<
    { success?: boolean; userId?: string; phoneNumber: string; password: string; firstName: string; identity: string;
        birthDate: number; longitude: number; latitude: number; lookingFor: string[]; referringUser?: string },
    { phoneNumber: string; password: string; firstName: string; identity: string; birthDate: number;
        longitude: number; latitude: number; lookingFor: string[]; referringUser?: string }
>('auth/signUp', async (credentials) => {
    const {
        phoneNumber, password, firstName, identity, birthDate,
        longitude, latitude, lookingFor, referringUser,
    } = credentials
    const { success } = await signUp(phoneNumber, password, firstName, identity, birthDate,
        longitude, latitude, lookingFor, referringUser)
    if (!success) throw new Error('sign up flow failed')
    return { success, phoneNumber, password, firstName, identity, birthDate, latitude, longitude, lookingFor, referringUser }
})

export const asyncConfirmCode = createAsyncThunk<
    { success: boolean; throttled?: boolean },
    { code: string; phoneNumber: string }
>('auth/confirmCode', async (credentials) => {
    const { code, phoneNumber } = credentials
    const { success, throttled } = await confirmCode(code, phoneNumber)
    if (!success) {
        throw new Error(
            throttled
                ? 'Attempt limit exceeded. Please wait before trying again.'
                : 'Password reset failed. Please check your verification code.'
        )
    }
    return { success }
})

/*
 * Resends confirmation/verification code to user's email. Only works for code sent
 * to confirm email address. For password reset codes, use asyncForgotPassword.
 */
// export const asyncResendCode = createAsyncThunk<{ success: boolean }, { phoneNumber: string }>(
//     'auth/resendCode',
//     async ({ phoneNumber }) => {
//         const { success, throttled } = await resendCode(phoneNumber)
//         if (!success) {
//             throw new Error(
//                 throttled
//                     ? 'Attempt limit exceeded. Please wait before trying again.'
//                     : 'Failed to resend code. Please contact us if this issue persists.'
//             )
//         }
//         return { success }
//     }
// )

export const asyncSignIn = createAsyncThunk<{ jwtToken?: string }, { phoneNumber: string; password: string }>(
    'auth/signIn',
    async (credentials) => {
        const { phoneNumber, password } = credentials
        const { success, jwtToken } = await signIn(phoneNumber, password)
        if (!success) throw new Error('authentication failed')
        return { jwtToken }
    }
)

export const asyncSignOut = createAsyncThunk<{ success: boolean }>('auth/signOut', async () => {
    const { success } = await signOut()
    return { success }
})

export const asyncChangePassword = createAsyncThunk<
    { success: boolean },
    { phoneNumber: string; oldPassword: string; newPassword: string }
>('auth/changePassword', async ({ phoneNumber, oldPassword, newPassword }) => {
    // need to return password from this method so we can pass it back to the API
    // for consumption by the API server consuming the rest of the fields
    const { success } = await changePassword(phoneNumber, oldPassword, newPassword)
    return { success }
})

export const asyncForgotPassword = createAsyncThunk<{ address?: string; phoneNumber: string }, { phoneNumber: string }>(
    'auth/forgotPassword',
    async (credentials) => {
        const { phoneNumber } = credentials
        const { success, address, throttled } = await forgotPassword(phoneNumber)
        if (!success) {
            throw new Error(
                throttled
                    ? 'Attempt limit exceeded. Please wait before trying again.'
                    : 'Password reset failed. Please check your verification code.'
            )
        }
        return { address, phoneNumber }
    }
)

export const asyncConfirmCodeUpdatePassword = createAsyncThunk<
    { success: boolean },
    { phoneNumber: string; code: string; newPassword: string }
>('auth/confirmCodeUpdatePassword', async (credentials) => {
    const { phoneNumber, code, newPassword } = credentials
    const { success, throttled } = await confirmCodeUpdatePassword(phoneNumber, code, newPassword)
    if (!success) {
        throw new Error(
            throttled
                ? 'Attempt limit exceeded. Please wait before trying again.'
                : 'Password reset failed. Please check your verification code.'
        )
    }
    return { success }
})

const getUser = () => {
    return new Promise<{ jwtToken?: string; role?: string }>((resolve, reject) => {
        const user = userPool.getCurrentUser()
        if (!user) {
            // resolve({ jwtToken: undefined, role: undefined })
            return reject('no authenticated user')
        }
        user.getSession((err: any, result: any) => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve({ jwtToken: result.getIdToken().getJwtToken(), role: result.getIdToken().payload['custom:role'] })
        })
    })
}

const signUp = (phoneNumber: string, password: string, firstName: string, identity: string, birthDate: number,
                longitude: number, latitude: number, lookingFor: string[], referringUser?: string
                ) => {
    return new Promise<{ success: boolean }>((resolve) => {
        let attributeList = []
        attributeList.push(new CognitoUserAttribute({Name: 'given_name', Value: firstName}))
        attributeList.push(new CognitoUserAttribute({Name: 'phone_number', Value: phoneNumber}))
        attributeList.push(new CognitoUserAttribute({Name: 'gender', Value: identity}))
        attributeList.push(new CognitoUserAttribute({Name: 'custom:longitude', Value: `${longitude}`}))
        attributeList.push(new CognitoUserAttribute({Name: 'custom:latitude', Value: `${latitude}`}))
        attributeList.push(new CognitoUserAttribute({Name: 'custom:lookingFor', Value: lookingFor.join(":")}))
        // convert a UNIX date into one that AWS likes
        attributeList.push(new CognitoUserAttribute({Name: 'birthdate', Value: getBirthDateString(birthDate)}))
        if (referringUser) {
            attributeList.push(new CognitoUserAttribute({Name: 'custom:referringUser', Value: referringUser}))
        }
        console.log(attributeList)

        userPool.signUp(phoneNumber, password, attributeList, [], (error?: Error, result?: ISignUpResult) => {
            if (error || !result) return resolve({ success: false })
            console.log(result)
            return resolve({ success: true })
        })
    })
}

const confirmCode = (code: string, phoneNumber: string) => {
    return new Promise<{ success: boolean; throttled?: boolean }>((resolve) => {
        const cognitoUser = new CognitoUser({ Username: phoneNumber, Pool: userPool })
        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (result === 'SUCCESS') {
                return resolve({ success: true })
            } else if (err) {
                console.error(err)
                return resolve({ success: false, throttled: err?.name === 'LimitExceededException' })
            }
            // @todo - add more error handling logic
            else return resolve({ success: false })
        })
    })
}

const resendCode = (phoneNumber: string) => {
    return new Promise<{ success: boolean; throttled?: boolean }>((resolve) => {
        const cognitoUser = new CognitoUser({ Username: phoneNumber, Pool: userPool })
        cognitoUser.resendConfirmationCode((err, result) => {
            if (err) {
                console.error(err)
                return resolve({ success: false, throttled: err?.name === 'LimitExceededException' })
            }
            return resolve({ success: true })
        })
    })
}

const signIn = (phoneNumber: string, password: string) => {
    return new Promise<{ success: boolean; jwtToken?: string }>((resolve) => {
        const authenticationDetails = new AuthenticationDetails({ Username: phoneNumber, Password: password })
        const cognitoUser = new CognitoUser({ Username: phoneNumber, Pool: userPool })
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const jwtToken = result.getIdToken().getJwtToken()
                return resolve({ success: true, jwtToken: jwtToken })
            },
            onFailure: (err) => {
                return resolve({ success: false })
            },
        })
    })
}

const signOut = () => {
    return new Promise<{ success: boolean }>((resolve) => {
        const user = userPool.getCurrentUser()
        if (!user) return resolve({ success: true })
        user.signOut(() => resolve({ success: true }))
    })
}

const changePassword = (phoneNumber: string, oldPassword: string, newPassword: string) => {
    return new Promise<{ success: boolean }>((resolve) => {
        const cognitoUser = new CognitoUser({ Username: phoneNumber, Pool: userPool })
        cognitoUser.changePassword(oldPassword, newPassword, (error, result) => {
            return resolve({ success: !error && result === 'SUCCESS' })
        })
    })
}

const forgotPassword = (phoneNumber: string) => {
    return new Promise<{ success: boolean; address?: string; throttled?: boolean }>((resolve) => {
        const cognitoUser = new CognitoUser({ Username: phoneNumber, Pool: userPool })
        cognitoUser.forgotPassword({
            onSuccess: (result) => {
                resolve({ success: true, address: result.CodeDeliveryDetails.Destination })
            },
            onFailure: (err) => {
                console.error(err)
                resolve({ success: false, throttled: err?.name === 'LimitExceededException' })
            },
        })
    })
}

const confirmCodeUpdatePassword = (phoneNumber: string, code: string, newPassword: string) => {
    return new Promise<{ success: boolean; throttled?: boolean }>((resolve) => {
        const cognitoUser = new CognitoUser({ Username: phoneNumber, Pool: userPool })
        cognitoUser.confirmPassword(code, newPassword, {
            onSuccess: (result) => {
                resolve({ success: true })
            },
            onFailure: (err) => {
                console.error(err)
                resolve({ success: false, throttled: err?.name === 'LimitExceededException' })
            },
        })
    })
}

export const {
    signInFlowStarted,
    forgotPasswordFlowStarted,
    forgotPasswordEmailSent,
    forgotPasswordFlowEnded,
    signUpFlowStarted,
    signUpFlowCanceled,
    clearCredentials,
} = authSlice.actions