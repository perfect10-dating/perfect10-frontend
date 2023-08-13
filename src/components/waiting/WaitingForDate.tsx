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
        <div>
            <p>You have a date scheduled with {(otherUser as UserMini).firstName}{isSetup ? "'s friend" : ""} on {(new Date(lockingDate.time)).toDateString()}</p>
            <p>You can match with more people when you have gone on that date and reviewed it.</p>
        </div>
    )
}