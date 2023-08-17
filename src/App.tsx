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

const getReferringUser = () => {
    const hrefArray = window.location.href.split('/')
    return hrefArray[hrefArray.length-1]
}

export default function App() {
    const dispatch = useAppDispatch()
    const hold = 0
    const user = useAppSelector(state => state.user.user)

    // when we load the app, try to get the user from localStorage immediately
    useEffect(() => {
        console.log("Getting user from localstorage")
        const getter = async () => {
            let result = await dispatch(asyncGetUser())
            console.log(result)
        }
        getter()
    }, [hold])

    const pending = useAppSelector((state) => state.auth.status) === 'loading'

    // prevent anything from occurring before we attempt auth
    if (pending) {
        return <Loading />
    }

    return (
            <Router>
                <div style={{position: "relative"}}>
                    {user && <TopBar user={user} />}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/referral/*" element={
                            <Home referringUser={getReferringUser()} />
                        } />
                        <Route path={"/account"} element={<AccountWrapper />} />
                        <Route path={"/priority"} element={<PriorityModePage />} />
                        <Route path={"/switch-room"} element={<RerollRoom />} />
                        {/*<Route path={"/test"} element={<Test />} />*/}
                        // TODO -- edit profile
                    </Routes>
                </div>
            </Router>
    )
}
