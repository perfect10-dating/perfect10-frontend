import { Popup } from "components/misc/Popup";
import { getOtherUserInDate, ProfileInRoom, userInDate } from "./ProfileInRoom";
import { ProfileInformation } from "./ProfileInformation";
import { useState } from "react";
import {store} from "../../app/store";

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

	const { user: ownUserState } = store.getState();
	let ownUser = ownUserState.user;

	const isMobile = window.innerWidth < 500

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
			{(props.isDisplayingCompetitors
				? props.competitors
				: props.potentialPartners
			).map((person, key) => {
				const potentialMatchedUsers = props.isDisplayingCompetitors
					? props.potentialPartners
					: props.competitors

				/**
				 * BEGIN SECTION: find any dates that involve both this profile and the logged-in user
				 */
				let date: Date | undefined = undefined;
				for (let possibleDate of props.dates) {
					// check to see if both the logged in user and the user for this profile are in this date
					if (
						ownUser &&
						userInDate(possibleDate, person._id) &&
						userInDate(possibleDate, ownUser._id)
					) {
						// if date is undefined, define it
						if (!date) {
							date = possibleDate;
						}
					}
				}

				/**
				 * BEGIN SECTION: Other dates
				 * (find any other dates that a competitor has agreed to with this user)
				 */
				let competitorHasDateWithProfile = false;
				let competitorDateIsSetup = false;
				let competitorDate: Date | undefined = undefined;
				let competitorId: string | undefined = undefined;
				let competitor: UserMini | undefined = undefined;

				// loops over dates and sees if any accepted dates with this user
				for (let dateObj of props.dates) {
					if (!dateObj || !dateObj.isAccepted) {
						continue;
					}
					for (let i = 0; i < dateObj.users.length; i++) {
						if (dateObj.users[i] === person._id) {
							competitorHasDateWithProfile = true;
							competitorDate = dateObj;

							// the date is a setup, and the competitor set it up
							if (dateObj.users.length === 1) {
								competitorDateIsSetup = true;
								competitorId = dateObj.setupResponsibleUser;
							} else {
								// the competitor is the other user
								competitorId = dateObj.users[i === 0 ? 1 : 0] as string;
							}

							break;
						}
					}
					// if this user set up the date
					if (dateObj.setupResponsibleUser === person._id) {
						competitorHasDateWithProfile = true;
						competitorDate = dateObj;
						competitorDateIsSetup = true;
						competitorId = dateObj.users[0];
					}
					if (competitorHasDateWithProfile) {
						break;
					}
				}

				// there is a competing user that already planned a date with this profile
				if (competitorId) {
					for (let tempCompetitor of potentialMatchedUsers) {
						if (tempCompetitor._id === competitorId) {
							competitor = tempCompetitor;
							break;
						}
					}
				}

				/**
				 * BEGIN SECTION: Conversation Information
				 */
				let messagesUnread = false;
				// loop over all conversations; find the one that references this profile
				for (let conversation of props.conversations) {
					for (let i = 0; i < conversation.users.length; i++) {
						if (conversation.users[i] === person._id) {
							// NOTE -- our user (ownUser) is the user at the OTHER index
							if (i === 0 && !conversation.user1Read) {
								messagesUnread = true;
							}
							if (i === 1 && !conversation.user0Read) {
								messagesUnread = true;
							}
						}
					}
				}

				let borderInformation = undefined
				if (messagesUnread) {
					borderInformation = "5px solid lightgreen"
				}
				if (date) {
					borderInformation = "5px solid #ba55d3"
				}

				return (
					<div>
						{(profileOpen && !!personDisplayed && personDisplayed._id === person._id) && (
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
									information={person}
									messagesUnread={messagesUnread}
									date={date}
								/>
							</Popup>
						)}

						<div
							key={key}
							style={{
								height: isMobile ? "53.3vw" : 300,
								width: isMobile ? "40vw" : 225,
								minWidth: isMobile ? "40vw" : 225,
								maxWidth: isMobile ? "40vw" : 225,
								margin: 10,
								marginBottom: 25,
								position: "relative",
								cursor: competitor ? "not-allowed" : "pointer",
							}}
						>
							{competitor && (
								<div
									style={{
										height: "100%",
										width: "100%",
										borderRadius: 15,
										position: "absolute",
										bottom: 0,
										zIndex: 50,
										backgroundColor: "rgba(139, 0, 0, 0.6)",
										color: "white",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center"
									}}
								>
									<div style={{margin: "10%", fontSize: 16}}>
										{person.firstName} agreed to a{" "}
										{competitorDateIsSetup ? "setup" : "date"} with{" "}
										{competitor.firstName}
										{competitorDateIsSetup && `'s friend`}
									</div>
								</div>
							)}

							<div onClick={() => {
								setProfileOpen(true);
								setPersonDisplayed(person);
							}}>
								<ProfileInformation
									border={borderInformation}
									isInCardDeck={true}
									scaleFontSize={isMobile ? (.4 * window.innerWidth / 300) : (3 / 4)}
									information={person}
									distance={person.distance || 0}
								></ProfileInformation>
							</div>
						</div>
					</div>
				);
			})
			}
		</div>
	);
}
