import {useGetRoomQuery, useGetUserQuery, useSwitchRoomsDelayedMutation} from "../../services/api";
import {Loading} from "@minchat/react-chat-ui";
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {setUser} from "../../services/userSlice";
import {LoadingWrapper} from "../misc/LoadingWrapper";
import {setMiddleContent} from "../../services/topBarSlice";
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

    // if no user, we'll pop back to the "/" route, which will handle login
    if (userReqFailed) {
        console.log("ACCOUNT-WRAPPER: Failed getting user object, navigating to '/'")
        dispatch(setUser({user: undefined}))
        navigate("/")
    }

    if (!user) {
        return <LoadingWrapper />
    }
    else {
        // set the user that we retrieved
        console.log("setting user...")
        dispatch(setUser({user}))
    
        dispatch(
          setMiddleContent({
              middleContent: (
                <div></div>
              )
          })
        )

        // penalty in days
        const penalty = -1 * ((user.freeSwaps || 0) -1)

        return (
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
                <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10}}>
                    <div style={{fontSize: 30}}>Nobody in your current room interests you?</div>
                    <div style={{marginTop: 10}}>Either set up one of your potential dates with a friend</div>
                    <div>(you will immediately switch rooms, but your friend's behavior will affect your Rizz)</div>
                    <div style={{marginTop: 10}}>or...</div>
                    <div style={{margin: "0 auto", marginTop: 10, cursor: "pointer", fontWeight: 600, width: "fit-content"}}
                         onClick={() => {
                             const confirmed = window.confirm(`Are you sure you want to switch rooms? This operation ${
                                 (penalty>0) ?
                                     `locks your account for ${penalty} day(s)` :
                                     "occurs immediately"
                             } and you will no longer be able to message people in this room.`)

                             if (confirmed) {
                                 switchRoomsDelayed()
                                 navigate("/")
                             }
                         }}
                    >{`Switch rooms ${
                        penalty>0 ?
                            `(locks your account for ${penalty} day(s))` :
                            "(occurs immediately)"
                    } >>`}
                    </div>

                </div>
            </div>
        )
    }
}