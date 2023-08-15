import {useCreateUserMutation, useFormRoomMutation} from "../../services/api";
import {useState} from "react";
import {ProfileInformation} from "./ProfileInformation";
import {ProfileMessages} from "./ProfileMessages";
import {ProfileInteractions} from "./ProfileInteractions";
import {userSlice} from "../../services/userSlice";
import {ProfileTopBar} from "./ProfileTopBar";

interface PropTypes {
    isCompetitor: boolean
    potentialMatchedUsers: UserMini[]
    information: UserMini
    dates: Date[]
}

function userInDate(date: Date, userId: string) {
    if (userId+"" === date.setupResponsibleUser+"") {
        return true
    }
    for (let userIdInArr of date.users) {
        if (userIdInArr+"" === userId+"") {
            return true
        }
    }
}

export function ProfileInRoom(props: PropTypes) {
    // can be "information", "messages", "interactions"
    const [screenSetting, setScreenSetting] = useState("messages")

    let date = undefined
    for (let possibleDate of props.dates) {
        // first, check to see if this profile is one described by the date
        if (userInDate(possibleDate, props.information._id)) {
            // if date is undefined, define it
            if (!date) {
                date = possibleDate
            }
            // otherwise, override it if the new date is accepted (i.e., someone else got in ahead of you)
            else {
                if (possibleDate.isAccepted) {
                    date = possibleDate
                    break
                }
            }
        }
    }

    let screenComponent
    switch (screenSetting) {
        case "information":
            screenComponent = (props.information.photoLinks && props.information.photoLinks.length >= 1) ?
                <ProfileInformation information={props.information} /> :
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

    // TODO -- does a competitor have a date set up with this profile?
    let competitorHasDateWithProfile = false
    let competitorDateIsSetup = false
    let competitorDate: Date
    let competitorId: string | undefined = undefined
    let competitor: UserMini | undefined = undefined

    // loops over dates and sees if any completed dates with this user
    for (let date of props.dates) {
        if (!date || !date.isAccepted) {
            continue
        }
        for (let i = 0; i < date.users.length; i++) {
            if (date.users[i] === props.information._id) {
                competitorHasDateWithProfile = true
                competitorDate = date

                if (date.users.length === 1) {
                    competitorDateIsSetup = true
                    competitorId = date.setupResponsibleUser
                }
                else {
                    competitorId = (date.users[i==0 ? 1 : 0] as string)
                }

                break
            }
        }
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
        <div style={{height: 400, width: 300, minWidth: 300, margin: 50}}>
            {
                competitor &&
                <div className={"date-overlay-panel-red"}>
                    {props.information.firstName} agreed to a {
                        competitorDateIsSetup ? "setup" : "date"
                    } with {competitor.firstName}{competitorDateIsSetup && `'s friend`}
                </div>
            }
            <ProfileTopBar screenSetting={screenSetting} setScreenSetting={setScreenSetting} />
            {screenComponent}
        </div>
    )
}