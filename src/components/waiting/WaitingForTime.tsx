import {useUnlockUserMutation} from "../../services/api";
import {useEffect, useState} from "react";

interface PropTypes {
    user: User
}
export function WaitingForTime(props: PropTypes) {
    let [unlockUser] = useUnlockUserMutation()

    const [time, setTime] = useState(Date.now);

    let millisecondsUntilUnlock = (new Date(props.user.unlockTime as string)).getTime() - time

    useEffect(() => {
        const interval = setInterval(() => {
            // don't keep updating time if we're unlocking
            if (millisecondsUntilUnlock >= 0) {
                setTime(Date.now);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    let seconds = Math.floor(millisecondsUntilUnlock / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)

    // if lock time expires, attempt to unlock the user
    if (millisecondsUntilUnlock <= 0) {
        unlockUser()
    }

    // TODO -- include a button "Unlock immediately" which allows either paid unlocks or referral unlocks
    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
            <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10}}>
                <p style={{fontSize: 30}}>Your Account is Temporarily Locked</p>
                <p style={{marginTop: 10}}>You can match with more people soon.</p>
                <p style={{marginTop: 10}}>Time until Unlock: {days} days, {hours % 24} hours, {minutes % 60} minutes, {seconds % 60} seconds</p>
            </div>
        </div>
    )
}