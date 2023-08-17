import {useGetUserQuery, useSwitchRoomsDelayedMutation} from "../../services/api";
import {Loading} from "@minchat/react-chat-ui";
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {setUser} from "../../services/userSlice";

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
        navigate("/")
    }

    if (!user) {
        return <Loading />
    }
    else {
        // set the user that we retrieved
        console.log("setting user...")
        dispatch(setUser({user}))
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
                    >{"Switch rooms (locks your account for three days) >>"}
                    </div>
                </div>
            </div>
        )
    }
}