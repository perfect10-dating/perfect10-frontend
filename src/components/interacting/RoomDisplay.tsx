interface PropTypes {
    isDisplayingCompetitors: boolean
    potentialPartners: [UserMini?]
    competitors: [UserMini?]
    dates: [Date?]
}

export function RoomDisplay(props: PropTypes) {
    return (
        <div>Hello, world!</div>
    )
}