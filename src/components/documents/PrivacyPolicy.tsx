import {
    Document, DocumentBoldSpan,
    DocumentFinalBlock,
    DocumentLastChanged,
    DocumentSubheader,
    DocumentTextBlock,
    DocumentTitle
} from "./DocumentComponents";

export function PrivacyPolicy() {
    return (
        <Document>
                <DocumentTitle>
                        Rizzly - Privacy Policy
                </DocumentTitle>

                <DocumentLastChanged>
                        Last Updated: 8/31/2023
                </DocumentLastChanged>

                <DocumentTextBlock>
                        Welcome to Rizzly! We respect your privacy and want to protect your personal data. This Privacy
                        Policy will tell you how we handle and protect your personal data when you join and use Rizzly.
                </DocumentTextBlock>

                <DocumentSubheader>
                        Information We Collect
                </DocumentSubheader>
                <DocumentTextBlock>
                    <DocumentBoldSpan>Personal Information:</DocumentBoldSpan> This includes your name, date of birth,
                    email address, phone number, profile photos, and any other personal details you choose to share with us.
                </DocumentTextBlock>
                <DocumentTextBlock>
                    <DocumentBoldSpan>Usage Data:</DocumentBoldSpan> We collect data on how you use Rizzly, such as your
                    search queries, the profiles you view, and interactions with other users.
                </DocumentTextBlock>
                <DocumentTextBlock>
                    <DocumentBoldSpan>Location Data:</DocumentBoldSpan> With your consent, we may collect and process
                    information about your precise location.
                </DocumentTextBlock>

                <DocumentSubheader>
                    How We Use Your Information
                </DocumentSubheader>
                <DocumentTextBlock>
                    <DocumentBoldSpan>To provide Rizzly services:</DocumentBoldSpan> This includes showing you potential
                    matches and allowing you to interact with them.
                </DocumentTextBlock>
                <DocumentTextBlock>
                    <DocumentBoldSpan>To communicate with you:</DocumentBoldSpan> We might send you notifications,
                    messages, and other updates.
                </DocumentTextBlock>
                <DocumentTextBlock>
                    <DocumentBoldSpan>For marketing purposes:</DocumentBoldSpan> We might send you promotional content,
                    but you can opt-out anytime.
                </DocumentTextBlock>

                <DocumentSubheader>
                    Protection of Personal Data
                </DocumentSubheader>
                <DocumentTextBlock>
                    We adopt secure measures to protect your data. While we strive to protect your data, we cannot
                    guarantee absolute security.
                </DocumentTextBlock>

                <DocumentSubheader>
                    Cookies and Tracking Technologies
                </DocumentSubheader>
                <DocumentTextBlock>
                    Rizzly uses cookies and similar technologies to understand how users navigate and use the platform.
                </DocumentTextBlock>

                <DocumentSubheader>
                    Sharing of Information
                </DocumentSubheader>
                <DocumentTextBlock>
                    We don't sell your personal information.
                </DocumentTextBlock>
                <DocumentTextBlock>
                    We may share your data with third parties only when we believe it's required by law or to protect
                    Rizzly and its users.
                </DocumentTextBlock>

                <DocumentSubheader>
                    Data Retention
                </DocumentSubheader>
                <DocumentTextBlock>
                    We retain your data as long as your account is active or as necessary to provide you services. You can
                    delete your account anytime, which will erase your personal data from our servers.
                </DocumentTextBlock>

                <DocumentSubheader>
                    Your Rights
                </DocumentSubheader>
                <DocumentTextBlock>
                    You can access, correct, or delete your personal information.
                </DocumentTextBlock>
                <DocumentTextBlock>
                    You have the right to opt-out of receiving marketing communications.
                </DocumentTextBlock>

                <DocumentSubheader>
                    Third-party Services
                </DocumentSubheader>
                <DocumentTextBlock>
                    Rizzly may contain links to third-party services. We don't own or control these services, and when
                    you interact with them, you may be providing information directly to them.
                </DocumentTextBlock>

                <DocumentSubheader>
                    Changes to the Privacy Policy
                </DocumentSubheader>
                <DocumentTextBlock>
                    We may change this policy from time to time, and if we do, we'll post any changes on this page.
                </DocumentTextBlock>

                <DocumentSubheader>
                    Contact Us
                </DocumentSubheader>
                <DocumentTextBlock>
                    If you have any questions about this Privacy Policy, please contact us at <a href={"mailto:askrizzly@gmail.com"}>
                    askrizzly@gmail.com
                </a>.
                </DocumentTextBlock>

                <DocumentFinalBlock>
                    By using Rizzly, you agree to the terms of this Privacy Policy.
                </DocumentFinalBlock>
        </Document>
    )
}