import {useCreateUserMutation, useFormRoomMutation} from "../../services/api";
import {useState} from "react";
import {ProfileInformation} from "./ProfileInformation";
import {ProfileMessages} from "./ProfileMessages";
import {ProfileInteractions} from "./ProfileInteractions";
import {userSlice} from "../../services/userSlice";

interface PropTypes {
    isCompetitor: boolean
    potentialMatchedUsers: UserMini[]
    information: UserMini
    dates: Date[]
}

export function ProfileInRoom(props: PropTypes) {
    // can be "information", "messages", "interactions"
    const [screenSetting, setScreenSetting] = useState("messages")

    let screenComponent
    switch (screenSetting) {
        case "information":
            screenComponent = <ProfileInformation information={props.information} />
            break
        case "messages":
            screenComponent = <ProfileMessages otherUser={props.information} />
            break
        case "interactions":
            screenComponent = <ProfileInteractions />
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
            <div style={{position: "absolute", zIndex: 10}}>
                <div
                    className={screenSetting === "information" ?
                        "profile-panel-button-selected" : "profile-panel-button-deselected"}
                    onClick={() => setScreenSetting("information")}
                >
                    Profile
                </div>
                <div
                    className={screenSetting === "messages" ?
                        "profile-panel-button-selected" : "profile-panel-button-deselected"}
                    onClick={() => setScreenSetting("messages")}
                >
                    Messages
                </div>
                <div
                    className={screenSetting === "interactions" ?
                        "profile-panel-button-selected" : "profile-panel-button-deselected"}
                    onClick={() => setScreenSetting("interactions")}
                >
                    Date
                </div>
            </div>
            {screenComponent}
        </div>
    )
}