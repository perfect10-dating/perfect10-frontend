import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Home } from './components/Home'
// import {Test} from "./components/Test";
import {Account} from "./components/account/Account";
import {useEffect} from "react";
import {asyncGetUser} from "./services/authSlice";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {Loading} from "@minchat/react-chat-ui";
import {AccountWrapper} from "./components/account/AccountWrapper";
import {TopBar} from "./components/misc/TopBar";
import {PriorityModePage} from "./components/premium/PriorityModePage";
import {RerollRoom} from "./components/interacting/RerollRoom";
import {setHasCollectedLocation} from "./services/userSlice";
import {useEditUserMutation} from "./services/api";
import {LoadingWrapper} from "./components/misc/LoadingWrapper";
import {ContactUs} from "./components/misc/ContactUs";

const getReferringUser = () => {
    const hrefArray = window.location.href.split('/')
    return hrefArray[hrefArray.length-1]
}

export default function App() {
    const dispatch = useAppDispatch()
    const hold = 0
    const [editUser] = useEditUserMutation()
    const user = useAppSelector(state => state.user.user)
    const hasUpdatedLocation = useAppSelector(state => state.user.hasUpdatedLocation)

    // when we load the app, try to get the cognito user from localStorage immediately
    useEffect(() => {
        console.log("Getting user from localstorage")
        const getter = async () => {
            let result = await dispatch(asyncGetUser())
            console.log(result)
        }
        getter()
    }, [hold])

    const getLocation = async () => {
        // do this preemptively, so we don't have to multiple times
        await dispatch(setHasCollectedLocation({hasUpdatedLocation: true}))
        let position: GeolocationPosition = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => resolve(position))
        })

        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        let loc: UserLocation = {type: 'Point', coordinates: [long, lat]}

        editUser({location: loc})
    }

    const pending = useAppSelector((state) => state.auth.status) === 'loading'

    // prevent anything from occurring before we attempt auth
    if (pending) {
        return(
            <div style={{position: "relative", height: "100vh"}}>
                <LoadingWrapper />
            </div>
            )
    }

    // if we have the user and have not updated location, do so
    if (user && !hasUpdatedLocation) {
        getLocation()
    }

    return (
            <Router>
                <div style={{position: "relative", height: "100vh"}}>
                    {user && <TopBar user={user} />}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/referral/*" element={
                            <Home referringUser={getReferringUser()} />
                        } />
                        <Route path={"/account"} element={<AccountWrapper />} />
                        <Route path={"/priority"} element={<PriorityModePage />} />
                        <Route path={"/switch-room"} element={<RerollRoom />} />
                        <Route path={"/contact-us"} element={<ContactUs />} />
                        {/*<Route path={"/test"} element={<Test />} />*/}
                        // TODO -- edit profile
                    </Routes>
                </div>
            </Router>
    )
}
