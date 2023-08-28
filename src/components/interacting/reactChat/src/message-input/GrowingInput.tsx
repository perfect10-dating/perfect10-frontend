import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface PropTypes {
	text: string;
	onChange: (text: string) => void;
}

export function GrowingInput(props: PropTypes) {
	const [height, setHeight] = useState(0);

	useEffect(() => {
		if (props.text === "") {
			setHeight(0);
		}
	}, [props.text]);

	return (
		<GrowingInputInner
			onChange={(e) => {
				props.onChange(e.target.value);
				setHeight(e.target.scrollHeight);
			}}
			// onContentSizeChange={(event) => {
			// 	setState({ height: event.nativeEvent.contentSize.height });
			// }}
			height={Math.max(35, height)}
			value={props.text}
			placeholder="Send a message..."
		/>
	);
}

const GrowingInputInner = styled.textarea<{ height: number }>`
	display: block;
	height: ${({ height }) => `${height}px`};
	min-height: ${({ height }) => `${Math.min(height, 70)}px`};
	max-height: 70px;
	margin: 10px auto;
	width: 230px;
	font-size: 16px;
	background-color: rgb(194, 213, 242);
	color: ${({ theme }) => theme.inputActive};
	border: none;
	border-radius: 10px;
	resize: none;

	outline: none;
	padding-top: 6px;
	padding-left: 10px;
	transition: 0.2s all;

	&::placeholder {
		color: ${({ theme }) => theme.inputPlaceholder};
	}
`;
