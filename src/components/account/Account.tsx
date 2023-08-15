import {useAppDispatch} from "../../app/hooks";
import {useEditUserMutation, useGetUserQuery} from "../../services/api";
import {useNavigate} from "react-router-dom";
import {LookingFor} from "./LookingFor";
import {Loading} from "@minchat/react-chat-ui";
import {AgeRange} from "./AgeRange";
import {useEffect, useState} from "react";
import {ImageUploadPanel} from "./ImageUploadPanel";
import {ProfileInteractions} from "../interacting/ProfileInteractions";
import {ProfileInformation} from "../interacting/ProfileInformation";

const POLLING_DELAY_SECONDS = 5
const USER_AVAILABLE_AGE_GAP = 15

interface PropTypes {
    user: User
}

const previewButtonSelectedStyle = {fontWeight: "bold"}
const previewButtonUnselectedStyle = {cursor: "pointer"}

export function Account(props: PropTypes) {
    // const cognitoId = "607865"  // 19
    // const cognitoId = "890233"     // matilda
    // const cognitoId = "foo"     // 19
    const [editUser] = useEditUserMutation()
    const {user} = props

    const [isDirty, setIsDirty] = useState(false)
    const [lookingFor, setLookingFor] = useState(user?.lookingFor || [])
    const [ageRange, setAgeRange] = useState(user?.ageRange || {min: 25, max: 35})
    const [photoLinks, setPhotoLinks] = useState(user?.photoLinks || [])
    const [willEdit, setWillEdit] = useState(false)

    const [isDisplayingPreview, setIsDisplayingPreview] = useState(false)

    useEffect(() => {
        console.log("Polling started")

        // will try to save the user
        const pollingFunction = async() => {
            while (true) {
                setWillEdit(true)
                await new Promise((resolve) => setTimeout(resolve, POLLING_DELAY_SECONDS * 1000))
            }
        }
        pollingFunction()
    }, [1])

    if (willEdit && isDirty && user) {
        setIsDirty(false)
        setWillEdit(false)
        editUser({lookingFor, ageRange, photoLinks: photoLinks.filter(link => link.length > 0)})
    }

    return (
        <div style={{height: "100vh", overflow: "scroll"}}>
            <div style={{width: 360, maxWidth: "100vw", margin: "0 auto", marginTop: 50, marginBottom: 50}}>
                {/*<div style={{textAlign: "center", fontSize: 30}}>*/}
                {/*    Welcome, {user?.firstName || "Stranger"}*/}
                {/*</div>*/}
                {/*<div style={{textAlign: "center", marginTop: -5}}>*/}
                {/*    {user.profileComplete ? "Continue editing your profile" : "Complete your profile"}*/}
                {/*</div>*/}

                <div style={{fontSize: 24, display: "flex", justifyContent: "space-between", marginLeft: 20, marginRight: 20}}>
                    <div style={!isDisplayingPreview ? previewButtonSelectedStyle : previewButtonUnselectedStyle}
                        onClick={() => setIsDisplayingPreview(false)}
                    >
                        Edit
                    </div>

                    <div style={isDisplayingPreview ? previewButtonSelectedStyle : previewButtonUnselectedStyle}
                         onClick={() => setIsDisplayingPreview(true)}
                    >
                        Preview
                    </div>
                </div>

                {
                    isDisplayingPreview ?
                        <ProfileInformation information={user} />
                    :
                        <div>
                            <ImageUploadPanel photoLinks={photoLinks}
                                              photoLinksCallback={(photoLinks) => {
                                                  setPhotoLinks(photoLinks)
                                                  setIsDirty(true)
                                              }} />
                            <LookingFor initialLookingFor={user.lookingFor} lookingForCallback={(lookingFor) => {
                                setLookingFor(lookingFor)
                                setIsDirty(true)
                            }} />
                            <AgeRange default={user.ageRange}
                                      limits={{min: Math.max(18, user.age-USER_AVAILABLE_AGE_GAP),
                                          max: Math.min(99, user.age+USER_AVAILABLE_AGE_GAP)}}
                                      onChange={(ageRange) => {
                                          setAgeRange(ageRange)
                                          setIsDirty(true)
                                      }} />
                        </div>
                }
            </div>
        </div>
    )
}