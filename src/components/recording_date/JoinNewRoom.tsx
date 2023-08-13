import {useReadyJoinRoomMutation} from "../../services/api";

interface PropTypes {
    user: User
}

/**
 * Props the user to join a new room. When they do so, updates their user object so that
 * the matchmaker will add them to a new room.
 * @param props
 * @constructor
 */
export function JoinNewRoom(props: PropTypes) {
    const [ readyJoinRoom ] = useReadyJoinRoomMutation()

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
            <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10}}>
                <p style={{fontSize: 30}}>Ready to talk to more people?</p>
                <p style={{marginTop: 10}}>When you're ready, we'll match you with a new room of members.</p>
                <p style={{marginTop: 10}}>Until then, nobody will see your profile.</p>
                <div style={{fontSize: 16, cursor: "pointer"}}
                    onClick={() => readyJoinRoom(props.user.cognitoId)}
                >
                    {"Join New Room >>"}
                </div>
            </div>
        </div>
    )
}