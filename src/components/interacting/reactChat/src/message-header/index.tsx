import React from "react";
import styled from "styled-components";
import useCheckIsMobile from "../hooks/useCheckIsMobile";

export type Props = {
	onBack?: () => void;
	children?: string;
	showBack?: boolean;
	mobileView?: boolean;
};

const Container = styled.div<{ mobile?: boolean }>`
	background-color: #f3f4f6;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;

	${({ mobile }) =>
		!mobile
			? `

margin-right: 12px;

`
			: `
`}
	height:56px;
	padding: 0px;
	box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.07999999821186066);
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	z-index: 10;
	display: flex;
	align-items: center;
	z-index: 10;
	box-sizing: border-box;
`;

const ChatTitle = styled.div`
	text-align: center;
	vertical-align: text-top;
	font-size: 20px;
	line-height: auto;
	color: #000000;
	position: absolute;
	width: 100%;
	font-weight: 500;
	font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
		"Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
		"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`;

export default function MessageHeader({ onBack, children, mobileView }: Props) {
	const mobile = useCheckIsMobile();
	return (
		<Container mobile={mobile || mobileView}>
			<ChatTitle className="fade-animation">{children}</ChatTitle>
			{/* <div id='subheader' class='subheader'>
                Seen 1 hour ago</div> */}

			{/* <div id='avatar/9/online👆' class='avatar/9/online👆'>
                <img id='online2' class='online2' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACHSURBVHgBjZDhDUAwFITvdQIbYAMj1CSMYANsYANs0hFsgA1swD3qn2gveWlf70tzOYFXtjYWgpbXgpNwHE7MWz5M6ssN7U3Lxw5fEnRbOvTCn2ouI/50ojSEKoTESIaHRViFgkcEmCi4RIDOMGgfxFiTYU/uF6anXcq7+5q0AYsn9+Ihp/4FtaknQrWVO5cAAAAASUVORK5CYII=' />
            </div> */}
		</Container>
	);
}
