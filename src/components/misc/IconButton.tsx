import styled from "styled-components/macro";
import React from "react";

interface Props {
	iconUrl?: string;
	iconComponent?: JSX.Element;
	alt: string;
	highlighted: boolean;
	backgroundUrl?: string;
	overlayUrl?: string;
	style?: React.CSSProperties; //Only use style here for positioning the IconButton
}

interface Action {
	handleClick: () => void;
}

export const IconButtonAction = (props: Props & Action) => {
	return (
		<div style={props.style} onClick={props.handleClick}>
			<IconButton {...props} />
		</div>
	);
};

const IconButton = ({
	iconUrl,
	iconComponent,
	highlighted,
	alt,
	backgroundUrl,
	overlayUrl,
}: Props) => {
	return (
		<StyledIconContainer style={{ justifyItems: "right" }}>
			{iconComponent ? (
				<StyledIconComponent>{iconComponent}</StyledIconComponent>
			) : (
				<StyledIconImage alt={alt} src={iconUrl} />
			)}
			<StyledIconOpacity highlighted={highlighted} />
			{backgroundUrl ? <StyledIconBackground src={backgroundUrl} /> : null}
		</StyledIconContainer>
	);
};

const StyledIconContainer = styled.div`
	position: relative;
	display: inline-block;
	width: 100px;
	height: 133px;
	user-select: none;
	cursor: pointer;
	overflow: hidden;
	color: #08324c;
`;

const StyledIconComponent = styled.div`
	position: absolute;
	right: 5px;
	width: 25%;
	height: 100%;
`;

const StyledIconOpacity = styled.div<{ highlighted: boolean }>`
	position: absolute;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.7);
	opacity: ${(props) => (props.highlighted ? "0" : "1")};
	transition: opacity 0.2s;
	&:hover {
		opacity: 0;
	}
`;

const StyledIconImage = styled.img`
	position: absolute;
	width: 100%;
	height: 100%;
`;

const StyledIconBackground = styled.img`
	max-width: 100%;
	width: 100%;
	height: 100%;
`;
