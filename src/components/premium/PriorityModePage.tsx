import { useGetUserQuery } from "../../services/api";
import { Loading } from "@minchat/react-chat-ui";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../services/userSlice";
import { useAppDispatch } from "../../app/hooks";
import { LoadingWrapper } from "../misc/LoadingWrapper";
import usePageTitle from "utils/usePageTitle";
import {setMiddleContent} from "../../services/topBarSlice";

export function PriorityModePage() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	usePageTitle("Rizzly | Priority Mode");

	const {
		data: user,
		isLoading: userIsLoading,
		isSuccess: userReqSuccessful,
		isError: userReqFailed,
		error: userReqError,
	} = useGetUserQuery();

	// if no user, we'll pop back to the "/" route, which will handle login
	if (userReqFailed) {
		console.log("PRIORITY_MODE: Failed getting user object, navigating to '/'");
		dispatch(setUser({ user: undefined }));
		navigate("/");
	}

	if (!user) {
		return <LoadingWrapper />;
	}

	dispatch(setUser({ user }));
	
	dispatch(
		setMiddleContent({
			middleContent: (
				<div></div>
			)
		})
	)
	
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				height: "100vh",
			}}
		>
			<div
				style={{
					maxWidth: "calc(100vw - 20)",
					maxHeight: "calc(100vh - 20)",
					textAlign: "center",
					margin: 10,
				}}
			>
				<p style={{ fontSize: 30 }}>Get Priority Mode!</p>
				{user.priorityMode && user.priorityModeExpiryTime && (
					<p style={{ marginTop: 10 }}>
						Your Priority Mode expires on{" "}
						{new Date(user.priorityModeExpiryTime).toDateString()}
					</p>
				)}
				<p style={{ marginTop: 10 }}>
					Members with Priority Mode have shorter wait times to get into rooms.
				</p>
				{/*<p style={{ marginTop: 10 }}>*/}
				{/*	This might be helpful for you if there are many people with your*/}
				{/*	identity and sexual orientation trying to join a room with a few other*/}
				{/*	members.*/}
				{/*</p>*/}
				<p style={{ marginTop: 10 }}>
					Priority Mode will be a paid feature in the future, but you can get it
					right now by referring your friends.
				</p>
				<p style={{ marginTop: 10 }}>
					Each person you refer gives you 30 days for free.
				</p>
				<p style={{ marginTop: 10 }}>Just use this referral link:</p>
				<p
					style={{ marginTop: 10, textDecoration: "underline", color: "blue" }}
				>
					{window.location.href.replace("priority", "") +
						`referral/${user._id.toString()}`}
				</p>
			</div>
		</div>
	);
}
