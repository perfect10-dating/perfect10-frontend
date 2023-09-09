import { useNavigate } from "react-router-dom";
import { asyncSignOut } from "../../services/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";

interface PropTypes {
	user: User;
	middleContent?: any;
}

const renderHamburgerDropdown = (
	navigate: (path: string) => void,
	onBackgroundClick: () => void
) => {
	return (
		<div style={{ position: "absolute" }}>
			<div
				style={{
					position: "absolute",
					display: "flex",
					flexDirection: "column",
					top: 39,
					left: 0,
					zIndex: 10000,
					backgroundColor: "lightgrey",
					marginLeft: -5,
					padding: 10,
					borderRadius: "0px 0px 10px 0px",
					width: 150,
					fontSize: 18,
				}}
			>
				<div
					style={{ cursor: "pointer", fontWeight: 500 }}
					onClick={() => {
						navigate("/");
						onBackgroundClick();
					}}
				>
					Date
				</div>
				<div
					style={{ cursor: "pointer", fontWeight: 500 }}
					onClick={() => {
						navigate("/account");
						onBackgroundClick();
					}}
				>
					Account
				</div>
				<div
					style={{ cursor: "pointer", fontWeight: 500 }}
					onClick={() => {
						navigate("/switch-room");
						onBackgroundClick();
					}}
				>
					Switch Room
				</div>
				<div
					style={{ cursor: "pointer", fontWeight: 500 }}
					onClick={() => {
						navigate("/priority");
						onBackgroundClick();
					}}
				>
					Priority Mode
				</div>
				<div
					style={{ cursor: "pointer", fontWeight: 500 }}
					onClick={() => {
						navigate("/contact-us");
						onBackgroundClick();
					}}
				>
					Contact Us
				</div>
			</div>
			<div
				style={{
					position: "absolute",
					width: "100vw",
					height: "100vh",
					top: 0,
					left: 0,
					zIndex: 9999,
				}}
				onClick={onBackgroundClick}
			/>
		</div>
	);
};

const renderHamburger = (onClick: () => void) => {
	return (
		<div
			style={{
				backgroundColor: "lightgrey",
				borderRadius: 5,
				border: "1px solid grey",
				cursor: "pointer",
				height: 35,
			}}
			onClick={onClick}
		>
			<div
				style={{
					backgroundColor: "darkgrey",
					width: 25,
					height: 4,
					margin: 5,
					borderRadius: 2,
				}}
			/>
			<div
				style={{
					backgroundColor: "darkgrey",
					width: 25,
					height: 4,
					margin: 5,
					borderRadius: 2,
				}}
			/>
			<div
				style={{
					backgroundColor: "darkgrey",
					width: 25,
					height: 4,
					margin: 5,
					borderRadius: 2,
				}}
			/>
		</div>
	);
};

export function TopBar(props: PropTypes) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const middleContent = useAppSelector((state) => state.topBar.middleContent);
	console.log(middleContent);

	// TODO -- images for each of these
	return (
		<div
			style={{
				position: "absolute",
				zIndex: 10000,
				top: 0,
				backgroundColor: "rgb(200, 200, 200)",
				display: "flex",
				justifyContent: "space-between",
				flexWrap: "wrap",
				padding: 5,
				width: "100vw",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				{renderHamburger(() => setIsDropdownOpen(!isDropdownOpen))}
			</div>

			{isDropdownOpen &&
				renderHamburgerDropdown(navigate, () => setIsDropdownOpen(false))}

			{middleContent && middleContent}

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<div
					style={{ fontSize: 20, cursor: "pointer", marginRight: "5px" }}
					onClick={async () => {
						await dispatch(asyncSignOut());
						// wait for the timeout so that auth state propagates before we get new user object
						await new Promise((resolve) => {
							setTimeout(resolve, 500);
						});
						dispatch({
							// format -- reducerPath/invalidateTags
							// see: https://github.com/reduxjs/redux-toolkit/issues/1862
							type: `api/invalidateTags`,
							payload: ["USER"],
						});
						navigate("/");
					}}
				>
					Log Out
				</div>
			</div>
		</div>
	);
}
