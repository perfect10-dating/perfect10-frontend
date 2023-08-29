import { useState } from "react";
import { fixIdentity } from "../../utils/fixIdentity";

interface PropTypes {
	border?: any,
	information: UserMini;
	isPreview?: boolean;
	isInCardDeck?: boolean; // if isInCardDeck, don't display top grey / white bars, or nav features
	scaleFontSize?: number; // scaleFontSize scales all fonts
	distance: number;
}

export function ProfileInformation(props: PropTypes) {
	const [photoLinkIndex, setPhotoLinkIndex] = useState(0);

	const scaleFont = props.scaleFontSize || 1;

	return (
		<div style={{ height: "100%", width: "100%" }}>
			{!props.isInCardDeck && (
				<div style={{ position: "absolute", width: "100%" }}>
					<div
						style={{
							margin: 10,
							display: "flex",
							justifyContent: "space-evenly",
						}}
					>
						{props.information.photoLinks.map((link, key) => {
							return (
								<div
									key={key}
									style={{
										backgroundColor: key === photoLinkIndex ? "white" : "grey",
										width: `${100 / props.information.photoLinks.length - 2}%`,
										height: 5,
										borderRadius: 2.5,
									}}
								/>
							);
						})}
					</div>
				</div>
			)}

			<div
				style={{
					position: "absolute",
					height: "15%",
					width: "40%",
					bottom: 0,
					left: "5%",
					color: "white",
					zIndex: 30,
				}}
			>
				<div style={{ display: "flex" }}>
					<div style={{ fontSize: 24 * scaleFont, fontWeight: "semibold" }}>
						{props.information.firstName}
					</div>
					<div
						style={{
							fontSize: 20 * scaleFont,
							marginLeft: "8%",
							marginTop: "4%",
						}}
					>
						{props.information.age}
					</div>
				</div>

				<div style={{ marginTop: -3, fontSize: 12 * scaleFont, marginLeft: 5 }}>
					{props.distance} miles away
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					height: "15%",
					width: "40%",
					bottom: 0,
					right: "5%",
					color: "white",
					textAlign: "right",
					justifyContent: "right",
					zIndex: 30,
				}}
			>
				<div
					style={{
						fontSize: 20 * scaleFont,
						marginLeft: "5%",
						marginTop: "5%",
					}}
				>
					{fixIdentity(props.information.identity)}
				</div>

				<div
					style={{ marginTop: -3, fontSize: 12 * scaleFont, marginRight: 5 }}
				>
					{props.information.shortTerm ? "Short-term" : "Long-term"}
				</div>
			</div>

			{!props.isInCardDeck && photoLinkIndex !== 0 && (
				<div
					style={{
						position: "absolute",
						height: "75%",
						width: "30%",
						color: "white",
						top: "10%",
						left: 0,
						fontSize: 60,
						cursor: "pointer",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						zIndex: 3,
					}}
					onClick={() => setPhotoLinkIndex(photoLinkIndex - 1)}
				>
					<div style={{ marginLeft: 15 }}>&#8249;</div>
				</div>
			)}

			{!props.isInCardDeck &&
				photoLinkIndex !== props.information.photoLinks.length - 1 && (
					<div
						style={{
							position: "absolute",
							height: "75%",
							width: "30%",
							color: "white",
							top: "10%",
							right: 0,
							fontSize: 60,
							cursor: "pointer",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							textAlign: "right",
							zIndex: 3,
						}}
						onClick={() => setPhotoLinkIndex(photoLinkIndex + 1)}
					>
						<div style={{ marginRight: 15 }}>&#8250;</div>
					</div>
				)}

			<div
				style={{
					height: "30%",
					width: "100%",
					borderRadius: 15,
					position: "absolute",
					bottom: 0,
					zIndex: 1,
					background: "linear-gradient(#0000, #000)",
				}}
			/>

			<img
				style={{
					height: "100%",
					width: "100%",
					borderRadius: 15,
					border: props.border || "1px solid lightgray",
				}}
				alt=""
				src={props.information.photoLinks[photoLinkIndex] || ""}
			/>
		</div>
	);
}
