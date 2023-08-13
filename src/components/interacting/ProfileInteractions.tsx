import PropTypes from "prop-types";
import {store} from "../../app/store";
import {useState} from "react";

interface PropTypes {
    otherUser: UserMini
    date?: Date
}

const outerDivStyle = {width: "100%", height: "100%", backgroundColor: "rgb(243,244,246)", borderRadius: 15}
const textStyle = {padding: 20, paddingTop: 70}

function ProposeDateForm() {
    return (
        <div style={outerDivStyle}>

        </div>
    )
}

function ProposeSetupForm() {
    return (
        <div style={outerDivStyle}>

        </div>
    )
}

export function ProfileInteractions(props: PropTypes) {
    const {"user": ownUserState} = store.getState()
    let ownUser = ownUserState.user

    let [ proposingDate, setProposingDate ] = useState(false)
    let [ proposingSetup, setProposingSetup ] = useState(false)

    if (props.date) {
        // if it's your date...
        if (ownUser && props.date.proposer === ownUser._id) {
            if (props.date.isSetup) {
                return (
                    <div style={outerDivStyle}>
                        <div style={textStyle}>
                            You suggested that {props.otherUser.firstName} go out with your friend. If {props.otherUser.firstName}
                            agrees, you'll have the opportunity to move to a new room immediately.
                        </div>

                        <div>
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

                        <div>
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

                        <div>
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

                        <div>
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
        return ProposeDateForm()
    }
    if (proposingSetup) {
        // TODO -- callbacks ...?
        return ProposeSetupForm()
    }

    return (
        <div style={outerDivStyle}>
            <div style={textStyle}>
                Once you and {props.otherUser.firstName} have agreed on a date, please let us know here!
                You can also choose to set {props.otherUser.firstName} up with a friend, if you're not interested
                in anyone in this room, but your friend is interested in {props.otherUser.firstName}
            </div>

            <div>
                Propose a date with {props.otherUser.firstName}
            </div>

            <div>
                Set {props.otherUser.firstName} up with a friend
            </div>
        </div>
    )
}