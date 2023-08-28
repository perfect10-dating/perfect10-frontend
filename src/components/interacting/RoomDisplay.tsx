import { getOtherUserInDate, ProfileInRoom, userInDate } from "./ProfileInRoom";
import { ProfileInformation } from "./ProfileInformation";

interface PropTypes {
	isDisplayingCompetitors: boolean;
	potentialPartners: UserMini[];
	competitors: UserMini[];
	dates: Date[];
	conversations: Conversation[];
}

export function RoomDisplay(props: PropTypes) {
	return (
		<div
			style={{
				maxWidth: "100vw",
				display: "inline-grid",
				gridTemplateColumns:
					"repeat(auto-fit, minmax(min(100%, max(250px, 100%/5)), auto))",
				position: "relative",
				justifyItems: "center",
				paddingLeft: "4vw",
				paddingRight: "4vw",
			}}
		>
			{(props.isDisplayingCompetitors
				? props.competitors
				: props.potentialPartners
			).map((person, key) => {
				return (
					<div
						style={{
							height: 300,
							width: 225,
							minWidth: 225,
							marginBottom: 25,
							position: "relative",
						}}
					>
						<ProfileInformation
							isInCardDeck={true}
							scaleFontSize={3 / 4}
							information={person}
							distance={person.distance || 0}
						></ProfileInformation>
					</div>
					// <ProfileInRoom
					// 	key={key}
					// 	isCompetitor={props.isDisplayingCompetitors}
					// 	information={person}
					// 	potentialMatchedUsers={
					// 		props.isDisplayingCompetitors
					// 			? props.potentialPartners
					// 			: props.competitors
					// 	}
					// 	conversations={props.conversations}
					// 	dates={props.dates}
					// />
				);
			})}
		</div>
	);
}
