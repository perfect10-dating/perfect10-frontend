import {useAppDispatch} from "../../app/hooks";
import {useGetUserQuery} from "../../services/api";
import {useNavigate} from "react-router-dom";

export function Account() {
    // const cognitoId = "607865"  // 19
    // const cognitoId = "890233"     // matilda
    // const cognitoId = "foo"     // 19
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    // set up API listeners for user, room, dates
    const {
        data: user,
        isLoading: userIsLoading,
        isSuccess: userReqSuccessful,
        isError: userReqFailed,
        error: userReqError,
        // isUninitialized
    } = useGetUserQuery()

    // if no user, we'll pop back to the "/" route, which will handle login
    if (!userReqFailed) {
        navigate("/")
    }

    return (
        <div>
            Continue filling out your account here, {user?.firstName || "stranger"}....
        </div>
    )
}