import {
        Document,
        DocumentFinalBlock,
        DocumentLastChanged,
        DocumentSubheader,
        DocumentTextBlock,
        DocumentTitle
} from "./DocumentComponents";

export function TermsAndConditions() {
    return (
        <Document>
            <DocumentTitle>
                Rizzly - Terms and Conditions
            </DocumentTitle>

            <DocumentLastChanged>
                Last Updated: 8/31/2023
            </DocumentLastChanged>

            <DocumentTextBlock>
                Welcome to Rizzly! Thank you for choosing our dating platform. These Terms and Conditions ("Terms")
                    govern your use of Rizzly and provide information about the Rizzly Service, outlined below.
                By using Rizzly, you agree to these Terms.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Acceptance of Terms:
            </DocumentSubheader>
            <DocumentTextBlock>
                    By accessing or using the Rizzly App, you signify your agreement to these Terms.
                    If you do not agree to these Terms, you may not access or use the Rizzly App.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Eligibility:
            </DocumentSubheader>
            <DocumentTextBlock>
                    You must be at least 18 years old to use Rizzly. By agreeing to these Terms, you represent and
                    warrant to us that you are at least 18.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Account Registration:
            </DocumentSubheader>
            <DocumentTextBlock>
                    To use Rizzly, you must register for an account. You agree to provide accurate, current, and
                    complete information during the registration process.
            </DocumentTextBlock>

            <DocumentSubheader>
                    User Content:
            </DocumentSubheader>
            <DocumentTextBlock>
                    Rizzly allows users to post, link, and otherwise make available certain information or content.
                    You are solely responsible for the content you post.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Prohibited Activities:
            </DocumentSubheader>
            <DocumentTextBlock>
                    Harassment, abusive language, and fraudulent activities are strictly prohibited. Any users found
                    engaging in such activities will have their accounts terminated.
            </DocumentTextBlock>

            {/*<DocumentSubheader>*/}
            {/*        Privacy:*/}
            {/*</DocumentSubheader>*/}
            {/*<DocumentTextBlock>*/}
            {/*        Your privacy is essential to us. Please review our Privacy Policy, which explains how we handle your personal data.*/}
            {/*</DocumentTextBlock>*/}

            <DocumentSubheader>
                    Termination:
            </DocumentSubheader>
            <DocumentTextBlock>
                    Rizzly reserves the right to terminate or suspend your account at its sole discretion.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Disclaimers:
            </DocumentSubheader>
            <DocumentTextBlock>
                    Rizzly is provided "as is" without any warranties, either express or implied.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Limitation of Liability:
            </DocumentSubheader>
            <DocumentTextBlock>
                    Rizzly shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                    or any loss of profits or revenues.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Dispute Resolution:
            </DocumentSubheader>
            <DocumentTextBlock>
                    You and Rizzly agree to resolve any disputes through final and binding arbitration, instead of in court.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Modifications to the Terms:
            </DocumentSubheader>
            <DocumentTextBlock>
                    Rizzly reserves the right to modify these Terms at any time. Your continued use of Rizzly constitutes
                    acceptance of those changes.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Governing Law:
            </DocumentSubheader>
            <DocumentTextBlock>
                    These Terms and any action related to them will be governed by the laws of the United States of America,
                    without regard to its conflict of laws provisions.
            </DocumentTextBlock>

            <DocumentSubheader>
                    Contact Information:
            </DocumentSubheader>

            <DocumentTextBlock>
                    If you have any questions about these Terms, please contact us at <a href={"mailto:askrizzly@gmail.com"}>
                    askrizzly@gmail.com
                    </a>.
            </DocumentTextBlock>

            <DocumentFinalBlock>
                    By creating an account and using Rizzly, you acknowledge that you have read, understood, and agree
                    to be bound by these Terms and any modifications that may be made to them in the future.
            </DocumentFinalBlock>
        </Document>
    )
}