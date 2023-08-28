import styled from "styled-components";

interface PropTypes {
	// which of the buttons to bold
	screenSetting: string;
	// a callback to change screen setting
	setScreenSetting?: (screenSetting: string) => void;
	// whether to mark messages as unread
	markMessagesUnread: boolean;
	// whether to mark interactions as unread
	markInteractionsUnread: boolean;
}

const profilePanelScreenSelected = {
	fontWeight: "bold",
	display: "flex",
	color: "white",
};
const profilePanelScreenDeselected = {
	cursor: "pointer",
	display: "flex",
	color: "white",
};

export function ProfileTopBar(props: PropTypes) {
	return (
		<div
			style={{
				position: "absolute",
				zIndex: 10,
				display: "flex",
				justifyContent: "space-evenly",
				width: 300,
				marginTop: -25,
				paddingBottom: 18,
			}}
		>
			<div
				style={
					props.screenSetting === "information"
						? profilePanelScreenSelected
						: profilePanelScreenDeselected
				}
				onClick={() =>
					props.setScreenSetting && props.setScreenSetting("information")
				}
			>
				Profile
			</div>
			<div
				style={
					props.screenSetting === "messages"
						? profilePanelScreenSelected
						: profilePanelScreenDeselected
				}
				onClick={() =>
					props.setScreenSetting && props.setScreenSetting("messages")
				}
			>
				Messages
				{props.markMessagesUnread && <TabUnread />}
			</div>
			<div
				style={
					props.screenSetting === "interactions"
						? profilePanelScreenSelected
						: profilePanelScreenDeselected
				}
				onClick={() =>
					props.setScreenSetting && props.setScreenSetting("interactions")
				}
			>
				Date
				{props.markInteractionsUnread && <TabUnread />}
			</div>
		</div>
	);
}

const TabUnread = styled.div`
	background-color: lightgreen;
	width: 7px;
	height: 7px;
	border-radius: 5px;
	margin-left: 2px;
	margin-top: 3px;
`;
