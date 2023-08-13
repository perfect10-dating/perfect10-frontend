import PropTypes from "prop-types";
import {store} from "../../app/store";
import {useState} from "react";
import {
    useAcceptDateMutation,
    useAcceptSetupMutation,
    useProposeDateMutation,
    useProposeSetupMutation, useRejectDateMutation
} from "../../services/api";
import {useTheme} from "styled-components";

interface PropTypes {
    otherUser: UserMini
    date?: Date
}

const outerDivStyle = {width: "100%", height: "100%",
    backgroundColor: "rgb(243,244,246)", borderRadius: 15,
    display: "flex", flexDirection: "column" as "column", justifyContent: "space-between"}
const textStyle = {padding: 20, paddingTop: 70}
const inputFormStyle = {width: "calc(100% - 20px)", padding: 10, marginTop: 5, height: 25,
    borderRadius: 10, border: 0, backgroundColor: "rgb(194, 213, 242)"}
const dateScheduleButtonStyle = {textAlign: "center" as "center", cursor: "pointer",
    marginBottom: 20}
const errorMessageContainerStyle = {color: "red", }

function ProposeDateForm(ownUser: User, otherUser: UserMini, proposeDate: any, timeOfDate: string, setTimeOfDate: any,
                         errorMessage: string, setErrorMessage: any, callback: any
                         ) {

    return (
        <div style={outerDivStyle}>
            <div style={textStyle}>
                <label>
                    Please specify the time for your date with {otherUser.firstName}
                    <input
                        type="datetime-local"
                        id="time-of-date"
                        name="time-of-date"
                        value={timeOfDate}

                        style={inputFormStyle}

                        onChange={(e) => {
                            setTimeOfDate(e.target.value)
                        }}
                    />
                </label>
                {errorMessage !== "" &&
                    <div style={errorMessageContainerStyle}>
                        {errorMessage}
                    </div>
                }
            </div>

            {
                timeOfDate !== "" &&
                <div style={dateScheduleButtonStyle} onClick={() => {
                    // schedule a date between the two users
                    let dateMilliseconds = (new Date(timeOfDate)).getTime()
                    if (dateMilliseconds < Date.now()) {
                        console.error("Cannot schedule a date in the past")
                        setErrorMessage("Cannot schedule a date in the past")
                        return
                    }
                    if (dateMilliseconds > Date.now() + 2628000000) {
                        console.error("Cannot schedule a date more than a month in the future")
                        setErrorMessage("Cannot schedule a date more than a month in the future")
                        return
                    }
                    setErrorMessage("")
                    proposeDate({cognitoId: ownUser.cognitoId, otherUserId: otherUser._id, time: dateMilliseconds})
                }
                }>
                    {"Schedule >>"}
                </div>
            }
        </div>
    )
}

function ProposeSetupForm(ownUser: User, otherUser: UserMini, proposeSetup: any, timeOfDate: string, setTimeOfDate: any,
    errorMessage: string, setErrorMessage: any, callback: any
) {
    return (
        <div style={outerDivStyle}>
            <div style={textStyle}>
                <label>
                    Please specify the time your friend would like to meet {otherUser.firstName}
                    <input
                        type="datetime-local"
                        id="time-of-date"
                        name="time-of-date"
                        value={timeOfDate}

                        style={inputFormStyle}

                        onChange={(e) => {
                            setTimeOfDate(e.target.value)
                        }}
                    />
                </label>
                {errorMessage !== "" &&
                    <div style={errorMessageContainerStyle}>
                        {errorMessage}
                    </div>
                }
            </div>

            {
                timeOfDate !== "" &&
                <div style={dateScheduleButtonStyle} onClick={() => {
                    // schedule a date between the two users
                    let dateMilliseconds = (new Date(timeOfDate)).getTime()
                    if (dateMilliseconds < Date.now()) {
                        console.error("Cannot schedule a date in the past")
                        setErrorMessage("Cannot schedule a date in the past")
                        return
                    }
                    if (dateMilliseconds > Date.now() + 2628000000) {
                        console.error("Cannot schedule a date more than a month in the future")
                        setErrorMessage("Cannot schedule a date more than a month in the future")
                        return
                    }
                    setErrorMessage("")
                    proposeSetup({cognitoId: ownUser.cognitoId, otherUserId: otherUser._id, time: dateMilliseconds})
                }
                }>
                    {"Schedule >>"}
                </div>
            }
        </div>
    )
}

export function ProfileInteractions(props: PropTypes) {
    const [timeOfDate, setTimeOfDate] = useState("")
    const {"user": ownUserState} = store.getState()
    let ownUser = ownUserState.user

    // set up the mutations
    let [ proposeDate ] = useProposeDateMutation()
    let [ proposeSetup ] = useProposeSetupMutation()
    let [ acceptDate ] = useAcceptDateMutation()
    let [ acceptSetup ] = useAcceptSetupMutation()
    let [ rejectDate ] = useRejectDateMutation()

    // set up the state
    let [ proposingDate, setProposingDate ] = useState(false)
    let [ proposingSetup, setProposingSetup ] = useState(false)
    let [ errorMessage, setErrorMessage ] = useState("")

    if (props.date) {
        const rejectDateFunction = () => {
            rejectDate({cognitoId: (ownUser as User).cognitoId, dateId: (props.date as Date)._id})
        }

        // if it's your date...
        if (ownUser && props.date.proposer === ownUser._id) {
            if (props.date.isSetup) {
                return (
                    <div style={outerDivStyle}>
                        <div style={textStyle}>
                            You suggested that {props.otherUser.firstName} go out with your friend. If {props.otherUser.firstName}
                            agrees, you'll have the opportunity to move to a new room immediately.
                        </div>

                        <div style={dateScheduleButtonStyle} onClick={rejectDateFunction}>
                            Withdraw your proposal
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div style={outerDivStyle}>
                        <div style={textStyle}>
                            You proposed a date with {props.otherUser.firstName}! If {props.otherUser.firstName}
                            agrees, we'll let you know!
                        </div>

                        <div style={dateScheduleButtonStyle} onClick={rejectDateFunction}>
                            Withdraw your proposal
                        </div>
                    </div>
                )
            }
        }

        // if the other person proposed the date...
        else {
            if (props.date.isSetup) {
                return (
                    <div style={outerDivStyle}>
                        <div style={textStyle}>
                            {props.otherUser.firstName} has a friend who wants to go out with you at {(new Date(props.date.time)).toDateString()}
                        </div>

                        <div>
                            Accept the date!
                        </div>

                        <div style={dateScheduleButtonStyle} onClick={rejectDateFunction}>
                            Reject the date...
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div style={outerDivStyle}>
                        <div style={textStyle}>
                            {props.otherUser.firstName} wants to go out with you at {(new Date(props.date.time)).toDateString()}
                        </div>

                        <div>
                            Accept the date!
                        </div>

                        <div style={dateScheduleButtonStyle} onClick={rejectDateFunction}>
                            Reject the date...
                        </div>
                    </div>
                )
            }
        }
    }

    // you're putting in the information to propose a new date
    if (proposingDate) {
        // TODO -- callbacks ...?
        return ProposeDateForm(ownUser as User, props.otherUser,
            proposeDate, timeOfDate, setTimeOfDate, errorMessage, setErrorMessage,
            () => setProposingDate(false))
    }
    if (proposingSetup) {
        // TODO -- callbacks ...?
        return ProposeSetupForm(ownUser as User, props.otherUser,
            proposeSetup, timeOfDate, setTimeOfDate, errorMessage, setErrorMessage,
            () => setProposingSetup(false))
    }

    return (
        <div style={outerDivStyle}>
            <div style={textStyle}>
                Once you and {props.otherUser.firstName} have agreed on a date, please let us know here!
                You can also choose to set {props.otherUser.firstName} up with a friend, if you're not interested
                in anyone in this room, but your friend is interested in {props.otherUser.firstName}.
                If they agree to go out with your friend, you'll be able to join a new room immediately.
            </div>

            <div>
                <div style={{cursor: "pointer", textAlign: "center"}} onClick={() => setProposingDate(true)}>
                    {`Propose a date with ${props.otherUser.firstName} >>`}
                </div>

                <div style={{cursor: "pointer", textAlign: "center", marginTop: 10, marginBottom: 30}}
                    onClick={() => setProposingSetup(true)}
                >
                    {`Set ${props.otherUser.firstName} up with a friend >>`}
                </div>
            </div>
        </div>
    )
}