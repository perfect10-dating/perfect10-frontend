import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {useGetCrushListQuery, useGetUserQuery, useLookupMutation} from "../../services/api";
import {setUser} from "../../services/userSlice";
import {LoadingWrapper} from "../misc/LoadingWrapper";
import {setMiddleContent} from "../../services/topBarSlice";
import {RoomDisplay} from "../interacting/RoomDisplay";
import {useEffect, useState} from "react";
import {Input} from "../entry/LoginComponents";
import styled from "styled-components";

/**
 * A function to query school databases
 *
 * @param school
 * @param query
 * @param setPotentialCrushes
 */
async function querySchoolDatabase(school: string, query: string, setPotentialCrushes: any) {
    return new Promise(async (resolve, reject) => {
        if (school === "dartmouth") {
            try {
                let part1 = await fetch(`https://api-lookup.dartmouth.edu/v1/lookup?q=${query}&includeAlum=false&field=uid&field=displayName&field=eduPersonPrimaryAffiliation&field=mail&field=eduPersonNickname&field=dcDeptclass&field=dcAffiliation&field=telephoneNumber&field=dcHinmanaddr`)
                let data = await part1.json()

                const returnVal = data.users
                    .filter((entry: any) => entry.eduPersonPrimaryAffiliation === "Student")
                    .slice(0, Math.min(data.users.length, 5))
                    .map((entry: any) => {
                        return ({email: entry.mail, name: entry.displayName, class: entry.dcDeptclass})
                    })

                if (returnVal.length > 0) {
                    setPotentialCrushes(returnVal)
                }
                return resolve(returnVal)
            } catch (err) {
                console.error(err)
                return resolve([])
            }
        }
        if (school === "uvm") {
            return resolve([])
        }
    })
}

export function Crushes() {
  const dispatch = useAppDispatch();
  
  const navigate = useNavigate()
  const [userLookup] = useLookupMutation()

  const [lookupWithEmail, setLookupWithEmail] = useState(false)
  const [school, setSchool] = useState("dartmouth")
  const [crushName, setCrushName] = useState("")
  const [potentialCrushes, setPotentialCrushes] =
      useState<{name: string; email: string, class: string}[]>([])

  const [emailAddress, setEmailAddress] = useState('')
  const [emailAddressStatus, setEmailAddressStatus] = useState<'default' | 'entering' | 'valid'>('default')

  const [yourCrushesOpen, setYourCrushesOpen] = useState(false)
  const [mutualCrushesOpen, setMutualCrushesOpen] = useState(false)

  useEffect(() => {
    const newStatus = emailAddress.length === 0 ? 'default' : /\S+@\S+\.\S+/.test(emailAddress) ? 'valid' : 'entering'
    setEmailAddressStatus(newStatus)
  }, [emailAddress])

  useEffect(() => {
      querySchoolDatabase(school, crushName, setPotentialCrushes)
  }, [school, crushName])
  
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

  let schoolArray =[
      {val: "dartmouth", display: "Dartmouth"},
      {val: "uvm", display: "UVM"},
  ]
  
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

          <div style={{display: "flex", justifyContent: "space-between",
              marginTop: 20, fontSize: 20
          }}>
              <div
                  style={{
                      fontWeight: lookupWithEmail ? 400 : 600,
                      cursor: "pointer"
                  }}
                onClick={() => setLookupWithEmail(false)}
              >
                  Crush Name
              </div>
              <div
                  style={{
                      fontWeight: lookupWithEmail ? 600 : 400,
                      cursor: "pointer"
                  }}
                onClick={() => setLookupWithEmail(true)}
              >
                  Crush Email
              </div>
          </div>
          {
              lookupWithEmail ?
                  <div style={{backgroundColor: "rgb(243,244,246)", borderRadius: 10, padding: "10px 20px",
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
                              placeholder={"Email"}
                              value={emailAddress}
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
              :
                  <div style={{backgroundColor: "rgb(243,244,246)", borderRadius: 10, padding: "10px 20px",
                  }}>
                      <div style={{fontSize: 16}}>
                          Add your crush's name. You'll only be visible to them if they crush on you too.
                      </div>
                      <div style={{display: "flex", justifyContent: "space-between"}}>
                          <select value={school}
                                  onChange={(e) => setSchool(e.target.value)}
                                    style={{height: 30, marginTop: 5, marginRight: 5}}
                          >
                          {
                              schoolArray.map(schoolObj => {
                                  return (
                                      <option value={schoolObj.val}>
                                        {schoolObj.display}
                                      </option>)
                              })
                          }
                          </select>
                          <Input
                              style={{
                                  marginTop: 5,
                                  marginBottom: 5,
                                  width: "100%",
                                  marginRight: 10,
                                  backgroundColor: "rgba(194, 213, 242, 0.5)",
                              }}
                              status={crushName.length > 0 ? "valid" : "default"}
                              placeholder={"Name"}
                              value={crushName}
                              onChange={(e) => setCrushName(e.target.value)} />
                      </div>

                      {
                          potentialCrushes.length > 0 &&

                          <div>
                              <div style={{textAlign: "left", fontSize: 16}}>
                                  Click on a person to crush on them
                              </div>
                              <div style={{borderTop: "1px solid black"}}>
                                  {
                                      potentialCrushes.map((crush, key) => {
                                          console.log(yourCrushes.filter(elem => {
                                              return elem+"" === crush.email+""
                                          }).length > 0)
                                          return (
                                              <PotentialCrushElement
                                                  crushed={yourCrushes.filter(elem => {
                                                      return elem+"" === crush.email+""
                                                  }).length > 0}
                                                  key={key}
                                                  onClick={() => {
                                                      userLookup({lookupEmail: crush.email})
                                                      setEmailAddress('')
                                                  }}>
                                                  <div>
                                                      {crush.name}
                                                  </div>
                                                  <div>
                                                      {crush.class}
                                                  </div>
                                              </PotentialCrushElement>
                                          )
                                      })
                                  }
                              </div>
                          </div>

                      }

                  </div>
          }

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
                  return <PotentialCrushElement crushed={false}>{crush}</PotentialCrushElement>
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
        
        <div>
          <div onClick={() => navigate("/")} style={{cursor: "pointer", fontSize: 24, marginTop: 40, marginBottom: 80}}>
            {user.profileComplete ? "F" : "Finish profile and f"}ind more matches {">>"}
          </div>
        </div>
      </div>
    </div>
  )
}

const PotentialCrushElement = styled.div<{crushed: boolean}>`
  font-size: 20px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 0px 5px;
  border-radius: 3px;
  background-color: ${({ crushed }) => crushed ? 
          "lightgreen" : 
          "rgba(0, 0, 0, 0)"};

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`