import {getOtherUserInDate, ProfileInRoom, userInDate} from "./ProfileInRoom";

interface PropTypes {
    isDisplayingCompetitors: boolean
    potentialPartners: UserMini[]
    competitors: UserMini[]
    dates: Date[]
}

export function RoomDisplay(props: PropTypes) {
    return (
        <div style={{overflowX: "auto", maxHeight: "100vh - 100px", maxWidth: "100vw",
            display: "flex", flexDirection: "row", position: "relative",
        }}>
            {
                (props.isDisplayingCompetitors ? props.competitors : props.potentialPartners).map(
                    (person, key) => {
                        return (
                            <ProfileInRoom
                                key={key}
                                isCompetitor={props.isDisplayingCompetitors}
                                information={person}
                                potentialMatchedUsers={props.isDisplayingCompetitors ?
                                                        props.potentialPartners : props.competitors}
                                dates={props.dates}
                            />
                        )
                    }
                )
            }
        </div>
    )
}