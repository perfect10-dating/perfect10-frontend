import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Home } from './components/Home'
import {Test} from "./components/Test";
import {Account} from "./components/account/Account";
import {useEffect} from "react";
import {asyncGetUser} from "./services/authSlice";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {Loading} from "@minchat/react-chat-ui";

export default function App() {
    const dispatch = useAppDispatch()
    const hold = 0

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
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path={"/account"} element={<Account />} />
          <Route path={"/test"} element={<Test />} />
          // TODO -- edit profile
      </Routes>
    </Router>
    )
}
