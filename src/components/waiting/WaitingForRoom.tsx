import {useFormRoomMutation} from "../../services/api";
import {useEffect} from "react";
const POLLING_DELAY_SECONDS = 60 * 10

interface PropTypes {
    user: User
}

export function WaitingForRoom(props: PropTypes) {
    const [ formRoom, statusObj ] = useFormRoomMutation()
    // define a polling function
    useEffect(() => {
        console.log("Polling started")

        // will try to recreate the room every 10 minutes (a good compromise between snappiness and server load)
        const pollingFunction = async() => {
            while (!statusObj.isSuccess && props.user.waitingForRoom) {
                formRoom()
                await new Promise((resolve) => setTimeout(resolve, POLLING_DELAY_SECONDS * 1000))
            }
        }
        pollingFunction()
    }, [props.user])

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
            <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10}}>
                <p style={{fontSize: 30}}>Building you a Room!</p>
                <p style={{marginTop: 10}}>We're finding you potential partners. This may take a while.</p>
                <p style={{marginTop: 10}}>You can safely leave and come back later.</p>
            </div>
        </div>
    )
}