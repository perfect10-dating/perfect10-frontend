import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {useGetUserQuery} from "../../services/api";
import {setUser} from "../../services/userSlice";
import {LoadingWrapper} from "../misc/LoadingWrapper";
import {setMiddleContent} from "../../services/topBarSlice";

export function Crushes() {
  const dispatch = useAppDispatch();
  
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
    dispatch(setUser({user: undefined}))
    navigate("/")
  }
  
  if (!user) {
    return <LoadingWrapper />
  }
  
  dispatch(
    setMiddleContent({
      middleContent: (
        <div style={{ maxWidth: "calc(100vw - 140px)" }}>
          <div
            style={{
              marginTop: "5px",
              fontSize: 24,
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            Welcome, {user.firstName}
          </div>
        </div>
      ),
    })
  );
  
  return <div></div>
}