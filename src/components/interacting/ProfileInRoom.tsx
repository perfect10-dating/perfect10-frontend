import { useEffect, useState } from "react";
import { ProfileInformation } from "./ProfileInformation";
import { ProfileMessages } from "./ProfileMessages";
import { ProfileInteractions } from "./ProfileInteractions";
import { ProfileTopBar } from "./ProfileTopBar";
import { store } from "../../app/store";

interface PropTypes {
	isCompetitor: boolean;
	information: UserMini;
	messagesUnread: boolean;
	date?: Date;
}

export function userInDate(date: Date, userId: string) {
	if (userId + "" === date.setupResponsibleUser + "") {
		return true;
	}
	for (let userIdInArr of date.users) {
		if (userIdInArr + "" === userId + "") {
			return true;
		}
	}
}

/**
 * Returns the ID, or user object, of the other user in the date
 */
export function getOtherUserInDate(date: Date, userId: string) {
	let setupResponsibleUserId = date.setupResponsibleUser;
	if (userId + "" !== setupResponsibleUserId + "") {
		return date.setupResponsibleUser;
	}
	for (let userInArr of date.users) {
		// case -- the id is a string
		if (userInArr + "" === userId + "") {
			return userInArr;
		}
	}
}

export function ProfileInRoom(props: PropTypes) {
	// can be "information", "messages", "interactions"
	const [screenSetting, setScreenSetting] = useState("information");
	const { user: ownUserState } = store.getState();
	let ownUser = ownUserState.user;

	// if important props change (rendering a new user) display their pics
	useEffect(() => {
		setScreenSetting("information");
	}, [props.isCompetitor, props.information._id]);

	let screenComponent;
	switch (screenSetting) {
		case "information":
			screenComponent =
				props.information.photoLinks &&
				props.information.photoLinks.length >= 1 ? (
					<ProfileInformation
						information={props.information}
						distance={props.information.distance || 0}
					/>
				) : (
					<div>Invalid Profile</div>
				);
			break;
		case "messages":
			screenComponent = <ProfileMessages otherUser={props.information} />;
			break;
		case "interactions":
			screenComponent = (
				<ProfileInteractions otherUser={props.information} date={props.date} />
			);
			break;
		default:
			screenComponent = <div />;
	}

	const scale = window.innerHeight / 400;

	// Due to the scale parameter: marginTop appears smaller at large screen heights and larger at small screen heights
	// calc(15vh + (1-scale)*35%)

	return (
		<div style={{ marginTop: `calc(10vh - ${(1 - scale) * 35}%)` }}>
			<div
				style={{
					height: 400,
					width: 300,
					minWidth: 300,
					position: "relative",
					display: "inline-block",
					scale: `${scale * 70}%`,
				}}
			>

				{!props.isCompetitor && (
					<ProfileTopBar
						screenSetting={screenSetting}
						setScreenSetting={setScreenSetting}
						markMessagesUnread={props.messagesUnread}
						markInteractionsUnread={!!props.date}
					/>
				)}
				{screenComponent}
			</div>
		</div>
	);
}
