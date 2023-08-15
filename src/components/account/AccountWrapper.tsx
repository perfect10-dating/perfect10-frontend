/**
 * A preloader to make sure the user is loaded before account mounts
 * @constructor
 */
import {useGetUserQuery} from "../../services/api";
import {Loading} from "@minchat/react-chat-ui";
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {Account} from "./Account";

export function AccountWrapper() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

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
        return <Account user={user} />
    }
}