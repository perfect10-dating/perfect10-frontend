import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {useGetCrushListQuery, useGetUserQuery, useLookupMutation} from "../../services/api";
import {setUser} from "../../services/userSlice";
import {LoadingWrapper} from "../misc/LoadingWrapper";
import {setMiddleContent} from "../../services/topBarSlice";
import {RoomDisplay} from "../interacting/RoomDisplay";
import {useState} from "react";

export function Crushes() {
  const dispatch = useAppDispatch();
  
  const navigate = useNavigate()
  const [userLookup] = useLookupMutation()
  
  const [isAddingCrushes, setIsAddingCrushes] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  
  const {
    data: user,
    isLoading: userIsLoading,
    isSuccess: userReqSuccessful,
    isError: userReqFailed,
    error: userReqError,
    // isUninitialized
  } = useGetUserQuery()

  const {
      data
  } = useGetCrushListQuery()
  let peopleCrushingOnYouCount = 0
  let userModels: UserMini[] = []
  let yourCrushes: string[] = []
  let conversations: Conversation[] = []

  if (data) {
      peopleCrushingOnYouCount = data.peopleCrushingOnYouCount
      userModels = data.userModels
      yourCrushes = data.yourCrushes
      conversations = data.conversations
  }

  // if no user, we'll pop back to the "/" route, which will handle login
  if (userReqFailed) {
    console.log("ACCOUNT-WRAPPER: Failed getting user object, navigating to '/'")
    dispatch(setUser({user: undefined}))
    navigate("/")
  }
  
  if (!user) {
    return <LoadingWrapper />
  }
  
  // set the user that we retrieved, if any
  dispatch(setUser({ user }));
  
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
  
  return (
    <div style={{paddingTop: 40, textAlign: 'center'}}>
      <div style={{marginTop: 60}}>
        <div style={{maxWidth: 300, display: "flex", justifyContent: "space-between", margin: "0 auto", fontSize: 16}}>
          <div style={{fontWeight: isAddingCrushes ? 300 : 600, cursor: "pointer"}}
            onClick={() => setIsAddingCrushes(false)}
          >
            View Crushes
          </div>
          
          <div style={{fontWeight: isAddingCrushes ? 600 : 300, cursor: "pointer"}}
            onClick={() => setIsAddingCrushes(true)}
          >
            Add Crushes
          </div>
        </div>
        
        <div style={{fontSize: 30}}>
          {peopleCrushingOnYouCount} people are crushing on you!
        </div>
        <div style={{fontSize: 20}}>
          You are crushing on {yourCrushes.length} people.
        </div>
      </div>
  
      {
        isAddingCrushes ?
          <div style={{marginTop: 20}}>
            <div style={{fontSize: 20}}>
              Add the email address of your crush
            </div>
            <input
              style={{width: 300}}
              onChange={(e) => setEmailAddress(e.target.value)} />
           
            <div
              style={{
                marginTop: 10,
                cursor: 'pointer',
                fontSize: 20
              }}
              onClick={() => {
              userLookup({lookupEmail: emailAddress})
              setEmailAddress('')
            }}>
              Add {">>"}
            </div>
            
            <div style={{marginTop: 20}}>
              <div style={{fontSize: 20}}>
                Your Crushes
              </div>
              <div>
                {
                  yourCrushes.map(crush => {
                    return <div>{crush}</div>
                  })
                }
              </div>
            </div>
          </div>
          :
          <div style={{marginTop: 20}}>
            <div style={{fontSize: 24}}>
              Mutual Crushes
            </div>
    
            {
              (userModels.length > 0) ?
                <RoomDisplay isDisplayingCompetitors={false} potentialPartners={userModels} competitors={[]} dates={[]}
                             conversations={conversations} /> :
                <div>No mutual crushes yet!</div>
            }
          </div>
      }
      
    </div>
  )
}