import { useState } from "react";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { authSlice } from "../../services/authSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";
import styled from "styled-components";
import {signInFlowStarted} from 'services/authSlice'

interface PropTypes {
	referringUser?: string;
	qrCode?: string;
}

export function LandingPage(props: PropTypes) {
	const { loginPage } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch()

	console.log(loginPage)

	switch (loginPage) {
		case "signIn":
			return <Login />;
		case "signUp":
			return (
				<SignUp referringUser={props.referringUser} qrCode={props.qrCode} />
			);
		case "forgotPassword":
			return <ForgotPassword />;
		case "resetPassword":
			return <ResetPassword />;
	}

	// otherwise, return the landing page
	return (
		<div style={{ width: "100vw", maxHeight: "100vh", overflow: "scroll" }}>
			<LandingPageTitle>RIZZLY</LandingPageTitle>
			<LandingPageCatchphrase>
				Online dating, for people with personalities.
			</LandingPageCatchphrase>

			<LandingPageTextBlockLeft>
				<LandingPageTextBlockLeftInner>
					<LandingPageTextBlockTitle>
						find people most compatible with you
					</LandingPageTextBlockTitle>
					<ul>
						<li>matches are vetted by other users</li>
						<li>fewer duds, more fun people</li>
						<li>no more bots, scammers, or ghosting</li>
					</ul>
				</LandingPageTextBlockLeftInner>
			</LandingPageTextBlockLeft>

			<LandingPageTextBlockRight>
				<LandingPageTextBlockRightInner>
					<LandingPageTextBlockTitle>
						a place for you, no matter who you are
					</LandingPageTextBlockTitle>
					<ul>
						<li>
							helps you find a life partner, someone looking for a single night
							of fun, or anyone in between
						</li>
						<li>
							safe & fun, regardless of your gender identity or sexual
							orientation
						</li>
					</ul>
				</LandingPageTextBlockRightInner>
			</LandingPageTextBlockRight>

			<LandingPageTextBlockLeft>
				<LandingPageTextBlockLeftInner>
					<LandingPageTextBlockTitle>
						fewer "matches", more dates
					</LandingPageTextBlockTitle>
					<ul>
						<li>see only the best few people at a time</li>
						<li>spend less time online, more in-person</li>
					</ul>
				</LandingPageTextBlockLeftInner>
			</LandingPageTextBlockLeft>

			<LandingPageLogin>
				<div
					onClick={() => dispatch(signInFlowStarted())}
					style={{ cursor: "pointer" }}
				>
					Log In or Sign Up {">>"}
				</div>
			</LandingPageLogin>
		</div>
	);
}

const LandingPageTitle = styled.div`
	font-size: 80px;
	text-align: center;
	margin-top: 30px;
`;

const LandingPageCatchphrase = styled.div`
	text-align: center;
	font-size: 24px;
	margin-top: -10px;
	margin-bottom: 75px;
`;

const LandingPageLogin = styled.div`
	text-align: center;
	font-size: 24px;
	margin-top: 60px;
	margin-bottom: 140px;
	font-weight: 500;
`;

const LandingPageTextBlockLeft = styled.div`
	width: max(50vw, min(85vw, 400px));
	margin: 10px auto;
`;

const LandingPageTextBlockRight = styled.div`
	width: max(50vw, min(85vw, 400px));
	margin: 10px auto;
	display: flex;
	justify-content: right;
`;

const LandingPageTextBlockLeftInner = styled.div`
	font-size: 16px;
	background-color: lightgray;
	width: fit-content;
	max-width: 500px;
	padding: 10px 20px;
	border-radius: 20px 20px 20px 0;
	margin-right: 15px;
`;

const LandingPageTextBlockRightInner = styled.div`
	font-size: 16px;
	background-color: rgb(58, 139, 246);
	color: white;
	width: fit-content;
	max-width: 500px;
	padding: 10px 20px;
	border-radius: 20px 20px 0 20px;
	margin-left: 15px;
`;

const LandingPageTextBlockTitle = styled.div`
	font-size: 20px;
`;
