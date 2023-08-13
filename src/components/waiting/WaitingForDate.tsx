interface PropTypes {
    user: User
}

export function WaitingForDate(props: PropTypes) {
    let lockingDate = (props.user.lockingDate as PopulatedDate)
    let isSetup = lockingDate.isSetup
    let otherUser = lockingDate.setupResponsibleUser
    if (!otherUser) {
        for (let userMini of lockingDate.users) {
            if (userMini._id+"" !== props.user._id+"") {
                otherUser = userMini
                break
            }
        }
    }

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
            <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10}}>
                <p style={{fontSize: 30}}>Time for a Real Connection!</p>
                <p style={{marginTop: 10}}>You have a date scheduled with {(otherUser as UserMini).firstName}{isSetup ? "'s friend" : ""} on {(new Date(lockingDate.time)).toDateString()}.</p>
                <p style={{marginTop: 10}}>You can match with more people when you have gone on that date and reviewed it.</p>
            </div>
        </div>
    )
}