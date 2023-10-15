import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {useGetCrushListQuery, useGetUserQuery, useLookupMutation} from "../../services/api";
import {setUser} from "../../services/userSlice";
import {LoadingWrapper} from "../misc/LoadingWrapper";
import {setMiddleContent} from "../../services/topBarSlice";
import {RoomDisplay} from "../interacting/RoomDisplay";
import {useEffect, useState} from "react";
import {Input} from "../entry/LoginComponents";

export function Crushes() {
  const dispatch = useAppDispatch();
  
  const navigate = useNavigate()
  const [userLookup] = useLookupMutation()
  
  const [isAddingCrushes, setIsAddingCrushes] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [emailAddressStatus, setEmailAddressStatus] = useState<'default' | 'entering' | 'valid'>('default')

  const [yourCrushesOpen, setYourCrushesOpen] = useState(false)
  const [mutualCrushesOpen, setMutualCrushesOpen] = useState(false)

  useEffect(() => {
    const newStatus = emailAddress.length === 0 ? 'default' : /\S+@\S+\.\S+/.test(emailAddress) ? 'valid' : 'entering'
    setEmailAddressStatus(newStatus)
  }, [emailAddress])
  
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
    <div style={{paddingTop: 40, textAlign: 'center', maxHeight: "100vh", overflow: "scroll"}}>
      <div style={{
        width: 420,
        maxWidth: "100vw",
        margin: "0 auto"
      }}>
        <div style={{marginTop: 60}}>
          {/*<div style={{maxWidth: 300, display: "flex", justifyContent: "space-between", margin: "0 auto", fontSize: 16}}>*/}
          {/*  <div style={{fontWeight: isAddingCrushes ? 300 : 600, cursor: "pointer"}}*/}
          {/*    onClick={() => setIsAddingCrushes(false)}*/}
          {/*  >*/}
          {/*    View Crushes*/}
          {/*  </div>*/}
          {/*  */}
          {/*  <div style={{fontWeight: isAddingCrushes ? 600 : 300, cursor: "pointer"}}*/}
          {/*    onClick={() => setIsAddingCrushes(true)}*/}
          {/*  >*/}
          {/*    Add Crushes*/}
          {/*  </div>*/}
          {/*</div>*/}
          
          <div style={{fontSize: 30}}>
            {peopleCrushingOnYouCount} {peopleCrushingOnYouCount === 1 ? "person is" : "people are"} crushing on you!
          </div>
        </div>
    
        <div style={{marginTop: 20, backgroundColor: "rgb(243,244,246)", borderRadius: 10, padding: "10px 20px",
        }}>
            <div style={{fontSize: 16}}>
              Add the email address of your crush
            </div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Input
                    style={{
                        marginTop: 5, 
                        marginBottom: 5, 
                        width: "100%",
                        marginRight: 10,
                        backgroundColor: "rgba(194, 213, 242, 0.5)",
                }}
                    status={emailAddressStatus}
                    defaultValue={"Email"}
                    onChange={(e) => setEmailAddress(e.target.value)} />
                <div
                    style={{
                        marginTop: 5,
                        height: 33,
                        cursor: 'pointer',
                        fontSize: 20,
                        backgroundColor: "rgb(194, 213, 242)",
                        borderRadius: 10,
                        padding: "2px 8px",
                    }}
                    onClick={() => {
                        userLookup({lookupEmail: emailAddress})
                        setEmailAddress('')
                    }}>
                    Add
                </div>
            </div>

            <div>
                You'll only be visible if they're crushing on you too
            </div>

          </div>
  
        <div style={{marginTop: 20}}>
          <div style={{fontSize: 24,
              backgroundColor: "rgb(243,244,246)",
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              padding: "2px 10px"
          }}

               onClick={() => setYourCrushesOpen(!yourCrushesOpen)}
          >
            Your Crushes
              <div>
                  {
                      yourCrushesOpen ?
                          "▲" :
                          "▼"
                  }
              </div>
          </div>
          <div>
            {
                yourCrushesOpen &&
              (yourCrushes.length > 0 ?
                yourCrushes.map(crush => {
                  return <div>{crush}</div>
                }) :
                <div>No crushes yet!</div>)
            }
          </div>
        </div>

        <div style={{marginTop: 20}}>
          <div style={{fontSize: 24,
              backgroundColor: "rgb(243,244,246)",
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              padding: "2px 10px"
          }}

               onClick={() => setMutualCrushesOpen(!mutualCrushesOpen)}
          >
          Mutual Crushes ({userModels.length})
              <div>
                  {
                      mutualCrushesOpen ?
                          "▲" :
                          "▼"
                  }
              </div>

          </div>
          {
              mutualCrushesOpen &&
            ((userModels.length > 0) ?
            <RoomDisplay isDisplayingCompetitors={false} potentialPartners={userModels} competitors={[]} dates={[]}
            conversations={conversations} /> :
            <div>No mutual crushes yet!</div>)
          }
        </div>
      </div>
    </div>
  )
}