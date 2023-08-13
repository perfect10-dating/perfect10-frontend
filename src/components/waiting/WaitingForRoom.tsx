interface PropTypes {
    user: User
}

export function WaitingForRoom(props: PropTypes) {
    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
            <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10}}>

            </div>
        </div>
    )
}