interface PropTypes {
    screenSetting: string
    setScreenSetting?: (screenSetting: string) => void
}

const profilePanelScreenSelected = {fontWeight: "bold"}
const profilePanelScreenDeselected = {cursor: "pointer"}

export function ProfileTopBar(props: PropTypes) {
    return (
        <div style={{position: "absolute", zIndex: 10, display: "flex", justifyContent: "space-evenly",
            width: 300, marginTop: -25, paddingBottom: 18}}>
            <div
                style={props.screenSetting === "information" ?
                    profilePanelScreenSelected : profilePanelScreenDeselected}
                onClick={() => props.setScreenSetting && props.setScreenSetting("information")}
            >
                Profile
            </div>
            <div
                style={props.screenSetting === "messages" ?
                    profilePanelScreenSelected : profilePanelScreenDeselected}
                onClick={() => props.setScreenSetting && props.setScreenSetting("messages")}
            >
                Messages
            </div>
            <div
                style={props.screenSetting === "interactions" ?
                    profilePanelScreenSelected : profilePanelScreenDeselected}
                onClick={() => props.setScreenSetting && props.setScreenSetting("interactions")}
            >
                Date
            </div>
        </div>
    )
}
