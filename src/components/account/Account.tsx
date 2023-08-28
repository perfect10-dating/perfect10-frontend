import { useAppDispatch } from "../../app/hooks";
import { useEditUserMutation, useGetUserQuery } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { LookingFor } from "./LookingFor";
import { AgeRange } from "./AgeRange";
import { useEffect, useState } from "react";
import { ImageUploadPanel } from "./ImageUploadPanel";
import { ProfileInformation } from "../interacting/ProfileInformation";
import { ShortTerm } from "./ShortTerm";
import usePageTitle from "utils/usePageTitle";

const POLLING_DELAY_SECONDS = 1;
const USER_AVAILABLE_AGE_GAP = 15;

interface PropTypes {
	user: User;
}

const previewButtonSelectedStyle = { fontWeight: "bold" };
const previewButtonUnselectedStyle = { cursor: "pointer" };

export function Account(props: PropTypes) {
	// const cognitoId = "607865"  // 19
	// const cognitoId = "890233"     // matilda
	// const cognitoId = "foo"     // 19
	const [editUser] = useEditUserMutation();
	const navigate = useNavigate();

	const { user } = props;

	const [photoLinks, setPhotoLinks] = useState(user?.photoLinks || []);
	const [shortTerm, setShortTerm] = useState(user.shortTerm);
	const [ageRange, setAgeRange] = useState(
		user?.ageRange || { min: 25, max: 35 }
	);

	const [isDisplayingPreview, setIsDisplayingPreview] = useState(false);

	usePageTitle("Rizzly | Account");

	return (
		<div style={{ height: "100vh", overflow: "scroll", paddingTop: 50 }}>
			<div
				style={{
					width: 360,
					maxWidth: "100vw",
					margin: "0 auto",
					marginTop: 50,
					marginBottom: 50,
				}}
			>
				{/*<div style={{textAlign: "center", fontSize: 30}}>*/}
				{/*    Welcome, {user?.firstName || "Stranger"}*/}
				{/*</div>*/}
				{/*<div style={{textAlign: "center", marginTop: -5}}>*/}
				{/*    {user.profileComplete ? "Continue editing your profile" : "Complete your profile"}*/}
				{/*</div>*/}

				<div
					style={{
						fontSize: 24,
						display: "flex",
						justifyContent: "space-between",
						marginLeft: 40,
						marginRight: 40,
					}}
				>
					<div
						style={
							!isDisplayingPreview
								? previewButtonSelectedStyle
								: previewButtonUnselectedStyle
						}
						onClick={() => setIsDisplayingPreview(false)}
					>
						Edit
					</div>

					<div
						style={
							isDisplayingPreview
								? previewButtonSelectedStyle
								: previewButtonUnselectedStyle
						}
						onClick={() => setIsDisplayingPreview(true)}
					>
						Preview
					</div>
				</div>

				{isDisplayingPreview ? (
					<div
						style={{
							height: 400,
							width: 300,
							minWidth: 300,
							marginLeft: "calc(50% - 150px)",
							position: "relative",
							display: "inline-block",
						}}
					>
						<ProfileInformation
							information={user}
							isPreview={true}
							distance={0}
						/>
					</div>
				) : (
					<div>
						<ImageUploadPanel
							photoLinks={user.photoLinks}
							photoLinksCallback={(photoLinks) => {
								editUser({
									photoLinks: photoLinks.filter((link) => link.length > 0),
								});
							}}
						/>
						<ShortTerm
							initialShortTerm={user.shortTerm}
							shortTermCallback={() => {
								editUser({ shortTerm: !shortTerm });
								setShortTerm(!shortTerm);
							}}
						/>
						<LookingFor
							initialLookingFor={user.lookingFor}
							lookingForCallback={(lookingFor) => {
								editUser({ lookingFor });
							}}
						/>
						<AgeRange
							userAge={user.age}
							default={user.ageRange}
							limits={{
								min: Math.max(18, user.age - USER_AVAILABLE_AGE_GAP),
								max: Math.min(99, user.age + USER_AVAILABLE_AGE_GAP),
							}}
							onChange={(newAgeRange) => {
								if (
									ageRange.min !== newAgeRange.min ||
									ageRange.max !== newAgeRange.max
								) {
									editUser({ ageRange: newAgeRange });
									setAgeRange(newAgeRange);
								}
							}}
						/>
					</div>
				)}
				{user.profileComplete && (
					<div
						style={{
							marginTop: 70,
							marginBottom: 80,
							cursor: "pointer",
							fontSize: 20,
							textAlign: "center",
						}}
						onClick={() => navigate("/")}
					>
						{"Finish Profile and Join Room >>"}
					</div>
				)}
			</div>
		</div>
	);
}
