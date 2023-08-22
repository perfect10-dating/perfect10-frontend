import {useGetRoomQuery, useGetUserQuery, useSwitchRoomsDelayedMutation} from "../../services/api";
import {Loading} from "@minchat/react-chat-ui";
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {setUser} from "../../services/userSlice";
const MAX_UNBALANCE = .30    // 3:4 person ratio (1/3) causes penalties, but 4:6 (2/4) does not

export function RerollRoom() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [switchRoomsDelayed] = useSwitchRoomsDelayedMutation()

    const {
        data: user,
        isLoading: userIsLoading,
        isSuccess: userReqSuccessful,
        isError: userReqFailed,
        error: userReqError,
        // isUninitialized
    } = useGetUserQuery()
    const {
        data: roomRetrievalObj,
        isLoading: roomIsLoading,
        isSuccess: roomReqSuccessful,
        isError: roomReqFailed,
        error: roomReqError
    } = useGetRoomQuery()

    // if no user, we'll pop back to the "/" route, which will handle login
    if (userReqFailed || roomReqFailed) {
        console.log("ACCOUNT-WRAPPER: Failed getting user object, navigating to '/'")
        dispatch(setUser({user: undefined}))
        navigate("/")
    }

    if (!user || !roomRetrievalObj) {
        return <Loading />
    }
    else {
        // set the user that we retrieved
        console.log("setting user...")
        dispatch(setUser({user}))

        let isOneSided = false
        let potentialPartners, competitors
        // if this is a one-identity room, your partners and competitors are the same
        // prevent you from seeing yourself
        if (roomRetrievalObj.room.sideTwo.length === 0) {
            isOneSided = true
            potentialPartners = roomRetrievalObj.room.sideOne
            competitors = potentialPartners
        }
        else if (roomRetrievalObj.room.sideOneIdentity === user?.identity) {
            potentialPartners = roomRetrievalObj.room.sideTwo
            competitors = roomRetrievalObj.room.sideOne
        } else {
            potentialPartners = roomRetrievalObj.room.sideOne
            competitors = roomRetrievalObj.room.sideTwo
        }

        const penalty = ((competitors.length-potentialPartners.length)/(potentialPartners.length||1) < MAX_UNBALANCE)

        return (
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
                <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10}}>
                    <div style={{fontSize: 30}}>Nobody in your current room interests you?</div>
                    <div style={{marginTop: 10}}>Either set up one of your potential dates with a friend</div>
                    <div>(you will immediately switch rooms, but your friend's behavior will affect your Rizz)</div>
                    <div style={{marginTop: 10}}>or...</div>
                    <div style={{marginTop: 10, cursor: "pointer"}}
                         onClick={() => {
                             switchRoomsDelayed()
                             navigate("/")
                         }}
                    >{`Switch rooms${
                        penalty ?
                        " (locks your account for three days)" :
                            " (occurs immediately)"
                    } >>`}
                        {
                            penalty &&
                            <div style={{fontSize: "10"}}>
                                Switches are free when your room is deeply unbalanced. Yours is not.
                            </div>
                        }
                    </div>

                </div>
            </div>
        )
    }
}