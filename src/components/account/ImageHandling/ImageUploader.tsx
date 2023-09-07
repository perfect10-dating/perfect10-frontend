import { useRef, useState } from "react";
import styled from "styled-components/macro";
import { v4 as uuid } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
// import { ImageScroller } from 'components/ImageHandling/ImageScroller' // todo: revisit

import { useGetS3SignedUrlMutation } from "services/api";

import PhotoCropper from "./PhotoCropper";
import { Popup } from "components/misc/Popup";

import { IconButtonAction } from "components/misc/IconButton";

interface Props {
	imageUrl: string;
	cropperAspectRatio?: number;
	handleChange: (imageUrl: string, attribution?: string) => void;
	style?: any;
}

export const ImageUploader = ({
	imageUrl,
	cropperAspectRatio,
	handleChange,
	style,
}: Props) => {
	const [getSignedUrl, result] = useGetS3SignedUrlMutation();
	const [file, setFile] = useState("");
	const id = uuid();
	const [attribution, setAttribution] = useState<string>("");
	const [rawImageUrl, setRawImageUrl] = useState<string>("");
	const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
	const [photoSelectorOpen, setPhotoSelectorOpen] = useState<boolean>(false);
	const [photoCropperOpen, setPhotoCropperOpen] = useState<boolean>(false);

	const fileInput = useRef<HTMLInputElement>(null);

	const openPhotoCropper = (photoUrl: string) => {
		if (!photoUrl) return;
		setRawImageUrl(photoUrl);
		setPhotoCropperOpen(false);
	};

	const handleSaveCrop = (croppedPhotoUrl: string) => {
		setRawImageUrl("");
		setCroppedImageUrl(croppedPhotoUrl);
		setPhotoCropperOpen(false);
		handleChange(croppedPhotoUrl, attribution);
	};

	const handleCancelCrop = () => {
		setRawImageUrl("");
		setCroppedImageUrl("");
		setPhotoCropperOpen(false);
	};

	const handleCancelSelect = () => {
		setPhotoSelectorOpen(false);
	};

	// const handleRemovePhotoUrl = (stateKey) => {
	//   const oldVal = this.state[stateKey]
	//   this.setState({ [stateKey]: '' }, () => {
	//     this.props.editSurvey({_id: this.props.survey._id, delta: { [stateKey]: '' } })
	//     .catch(() => {
	//       alert('Unable to save image. Please check your internet connnection and try reloading the page. Contact us if this issue persists.')
	//       this.setState({[stateKey]: oldVal})
	//     })
	//   })
	// }

	const handleFinishedUploading = (imageUrl: string, attribution?: string) => {
		setRawImageUrl(imageUrl);
		setPhotoCropperOpen(true);
		setAttribution(attribution || "");
	};

	const uploadFromLocal = () => {
		fileInput.current?.click();
	};

	return (
		<div style={style}>
			<input
				type="file"
				accept="image/*"
				id={id}
				ref={fileInput}
				style={{ display: "none" }}
				onChange={(event: any) => {
					if ((event.target.files?.length || 0) > 0) {
						const file = event.target.files[0];
						const type = file.type;
						const reader: any = new FileReader();
						reader.addEventListener(
							"load",
							() => {
								setRawImageUrl(reader.result);
								setPhotoCropperOpen(true);
							},
							false
						);
						reader.readAsDataURL(file);
						event.target.value = ""; // This clears the file selection, allowing the user to upload, remove, and reupload the same image
					}
				}}
			/>
			<div></div>
			<IconButtonAction
				style={{
					margin: 10,
					height: 100 / (cropperAspectRatio || 1),
					width: 100,
				}}
				handleClick={() => uploadFromLocal()}
				iconUrl={
					// use iconUrl only when we're uploading an image for the first time
					imageUrl === ""
						? "/img/standard_icons/upload-theory-v1.png"
						: undefined
				}
				iconComponent={
					// use the iconComponent instead of the iconUrl when we already have a valid image
					imageUrl !== "" ? (
						// div to add background circle
						<div
							style={{
								marginTop: 2,
								borderWidth: 3,
								borderRadius: 14,
								width: 28,
								height: 28,
								borderColor: "#000000",
								backgroundColor: "#FFFFFF70", // last two digits are opacity
							}}
						>
							<EditIcon
								style={{
									opacity: "100%",
									paddingTop: "3px",
									paddingLeft: "3px",
								}}
							></EditIcon>
						</div>
					) : undefined
				}
				alt={"Upload an Image"}
				highlighted={imageUrl !== ""}
				backgroundUrl={croppedImageUrl !== "" ? croppedImageUrl : imageUrl}
			/>

			{photoCropperOpen && (
				<Popup style={{}} handleBackgroundClick={handleCancelCrop}>
					<div className="photo-cropper-overlay">
						<PhotoCropper
							aspectRatio={cropperAspectRatio}
							lockAspectRatio={!!cropperAspectRatio}
							src={rawImageUrl}
							onSave={handleSaveCrop}
							onCancel={handleCancelCrop}
						/>
					</div>
				</Popup>
			)}
		</div>
	);
};
