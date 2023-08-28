import {useEffect, useState} from "react";
import {ProfileInformation} from "./ProfileInformation";
import {ProfileMessages} from "./ProfileMessages";
import {ProfileInteractions} from "./ProfileInteractions";
import {ProfileTopBar} from "./ProfileTopBar";
import {store} from "../../app/store";

interface PropTypes {
    isCompetitor: boolean
    potentialMatchedUsers: UserMini[]
    information: UserMini
    dates: Date[]
}

export function userInDate(date: Date, userId: string) {
    if (userId+"" === date.setupResponsibleUser+"") {
        return true
    }
    for (let userIdInArr of date.users) {
        if (userIdInArr+"" === userId+"") {
            return true
        }
    }
}

/**
 * Returns the ID, or user object, of the other user in the date
 */
export function getOtherUserInDate(date: Date, userId: string) {
    let setupResponsibleUserId = date.setupResponsibleUser
    if (userId+"" !== setupResponsibleUserId+"") {
        return date.setupResponsibleUser
    }
    for (let userInArr of date.users) {
        // case -- the id is a string
        if (userInArr+"" === userId+"") {
            return userInArr
        }
    }
}

export function ProfileInRoom(props: PropTypes) {
    // can be "information", "messages", "interactions"
    const [screenSetting, setScreenSetting] = useState("information")
    const {"user": ownUserState} = store.getState()
    let ownUser = ownUserState.user

    // if important props change (rendering a new user) display their pics
    useEffect(() => {
        setScreenSetting("information")
    }, [props.isCompetitor, props.information._id])

    let date = undefined
    for (let possibleDate of props.dates) {
        // check to see if both the logged in user and the user for this profile are in this date
        if (ownUser && userInDate(possibleDate, props.information._id) && userInDate(possibleDate, ownUser._id)) {
            // if date is undefined, define it
            if (!date) {
                date = possibleDate
            }
        }
    }

    let screenComponent
    switch (screenSetting) {
        case "information":
            screenComponent = (props.information.photoLinks && props.information.photoLinks.length >= 1) ?
                <ProfileInformation information={props.information} distance={props.information.distance || 0} /> :
                <div>Invalid Profile</div>
            break
        case "messages":
            screenComponent = <ProfileMessages otherUser={props.information} />
            break
        case "interactions":
            screenComponent = <ProfileInteractions otherUser={props.information} date={date} />
            break
        default:
            screenComponent = <div />
    }

    // does a competitor have a date set up with this profile?
    let competitorHasDateWithProfile = false
    let competitorDateIsSetup = false
    let competitorDate: Date
    let competitorId: string | undefined = undefined
    let competitor: UserMini | undefined = undefined

    // loops over dates and sees if any accepted dates with this user
    for (let date of props.dates) {
        if (!date || !date.isAccepted) {
            continue
        }
        for (let i = 0; i < date.users.length; i++) {
            if (date.users[i] === props.information._id) {
                competitorHasDateWithProfile = true
                competitorDate = date

                // the date is a setup, and the competitor set it up
                if (date.users.length === 1) {
                    competitorDateIsSetup = true
                    competitorId = date.setupResponsibleUser
                }
                else {
                    // the competitor is the other user
                    competitorId = (date.users[i==0 ? 1 : 0] as string)
                }

                break
            }
        }
        // if this user set up the date
        if (date.setupResponsibleUser === props.information._id) {
            competitorHasDateWithProfile = true
            competitorDate = date
            competitorDateIsSetup = true
            competitorId = date.users[0]
        }
        if (competitorHasDateWithProfile) {
            break
        }
    }

    if (competitorId) {
        for (let tempCompetitor of props.potentialMatchedUsers){
            if (tempCompetitor._id === competitorId) {
                competitor = tempCompetitor
                break
            }
        }
    }

    return (
        <div style={{height: 400, width: 300, minWidth: 300, margin: 50, position: "relative", display: "inline-block"}}>
            {
                competitor &&
                <div style={{height: "100%", width: "100%", borderRadius: 15,
                    position: "absolute", bottom: 0, zIndex: 50,
                    backgroundColor: "red", color: "white",
                }}>
                    {props.information.firstName} agreed to a {
                        competitorDateIsSetup ? "setup" : "date"
                    } with {competitor.firstName}{competitorDateIsSetup && `'s friend`}
                </div>
            }
            {!props.isCompetitor &&
                <ProfileTopBar
                    screenSetting={screenSetting}
                    setScreenSetting={setScreenSetting}
                    markMessagesUnread={true}
                    markInteractionsUnread={!!date}
                />}
            {screenComponent}
        </div>
    )
}