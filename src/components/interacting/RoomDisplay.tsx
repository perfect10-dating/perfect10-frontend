import { Popup } from "components/misc/Popup";
import { getOtherUserInDate, ProfileInRoom, userInDate } from "./ProfileInRoom";
import { ProfileInformation } from "./ProfileInformation";
import { useState } from "react";

interface PropTypes {
	isDisplayingCompetitors: boolean;
	potentialPartners: UserMini[];
	competitors: UserMini[];
	dates: Date[];
	conversations: Conversation[];
}

export function RoomDisplay(props: PropTypes) {
	const [profileOpen, setProfileOpen] = useState(false);
	const [personDisplayed, setPersonDisplayed] = useState<UserMini | undefined>(
		undefined
	);

	return (
		<div
			style={{
				maxWidth: "100vw",
				display: "flex",
				flexWrap: "wrap",
				position: "relative",
				justifyContent: "center",
				paddingLeft: "4vw",
				paddingRight: "4vw",
			}}
		>
			{profileOpen && !!personDisplayed && (
				<Popup
					handleBackgroundClick={() => setProfileOpen(false)}
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "rgba(0, 0, 0, 0.85)",
					}}
				>
					<ProfileInRoom
						isCompetitor={props.isDisplayingCompetitors}
						information={personDisplayed}
						potentialMatchedUsers={
							props.isDisplayingCompetitors
								? props.potentialPartners
								: props.competitors
						}
						conversations={props.conversations}
						dates={props.dates}
					/>
				</Popup>
			)}

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
							maxWidth: 225,
							margin: 10,
							marginBottom: 25,
							position: "relative",
						}}
						onClick={() => {
							setProfileOpen(true);
							setPersonDisplayed(person);
						}}
					>
						<ProfileInformation
							isInCardDeck={true}
							scaleFontSize={3 / 4}
							information={person}
							distance={person.distance || 0}
						></ProfileInformation>
					</div>
				);
			})}
		</div>
	);
}
