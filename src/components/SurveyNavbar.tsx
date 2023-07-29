import { Fragment, useState } from 'react'
import { Outlet } from 'react-router-dom' //useParams

import styled from 'styled-components'

import { useAppSelector } from '../app/hooks'

export function SurveyNavbar() {
  const questions = useAppSelector((state) => state.survey.questions)
  const questionIndex = useAppSelector((state) => state.survey.questionIndex)
  const completed = useAppSelector((state) => state.survey.completed)
  const navbarImageUrl = useAppSelector((state) => state.survey.navbarImageUrl)

  const [infoOverlayOpen, setInfoOverlayOpen] = useState<boolean>(false)

  let headerText =
    !completed && questions.length === 0
      ? 'Survey loading...'
      : completed || questionIndex + 1 > questions.length
      ? 'Survey Complete'
      : `Question ${questionIndex + 1}/${questions.length}`

  const renderMediaAttributions = (questions: any) => {
    let output: any = []
    questions.forEach((question: any, questionIndex: number) => {
      switch (question.type) {
        case 'boolean':
        case 'rate':
        case 'text':
          if (question.image?.attribution) {
            output.push(
              <p>
                Question {questionIndex}: {question.image?.attribution || 'None'}
              </p>
            )
          }
          break
        case 'multiple-choice':
        case 'rank':
          question.choices.forEach((choice: any, choiceIndex: number) => {
            if (choice.image?.attribution) {
              output.push(
                <p>
                  Question {questionIndex}, Choice {choiceIndex + 1}: {choice.image?.attribution || 'None'}
                </p>
              )
            }
          })
          break
        default:
          break
      }
    })
    return output.length > 0 ? (
      <Fragment>
        <h1>Attributions</h1>
        {output}
      </Fragment>
    ) : null
  }

  return (
    <div>
      <Bar>
        <Baseline>
          <Header>{headerText}</Header>
          <span>
            <Logo src={navbarImageUrl} />
            <InfoButton
              onClick={() => {
                setInfoOverlayOpen(!infoOverlayOpen)
              }}
              src={'/img/engagement_icons/info.png'}
            />
          </span>
        </Baseline>
      </Bar>
      <Outlet />
      {infoOverlayOpen && (
        <InfoOverlay>
          <p
            style={{ float: 'right', marginTop: 40, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => setInfoOverlayOpen(false)}
          >
            Close
          </p>
          {renderMediaAttributions(questions)}
          <h1>Privacy Policy</h1>
          <h2>Effective Date: 11/04/2021</h2>
          Overview
          <br />
          Bellwether Insight has developed this Privacy Policy to help you understand how we will collect, use, and
          share your information when you visit or interact with our site, engage.bellwetherinsight.com (BWI), as
          when you interact with brands, organizations, institutions, or websites that are using the BWI
          technology, services, analytics, and any other linked pages, features, content, or any other services we
          offer (collectively, the “Services”).
          <br />
          <br />
          <br />
          Types of Information Collected
          <br />
          The term “personal information” as used in this Privacy Policy refers to information that specifically
          identifies an individual (such as an individual’s first and last name, address, telephone number, e-mail
          address, credit card or other account number), and information about that individual or such individual’s
          activities or preferences when such information is directly linked to information that specifically
          identifies the individual. The Services collect personal information when you interact with it: for
          example when you, subscribe for newsletters; register for membership services; respond to polls or
          surveys; purchase merchandise; or seek help from our customer service departments. We also collect
          personal information when you purchase products or services offline. Sometimes, you will be provided with
          a short notice that reminds you to refer to this Privacy Policy and other relevant information from us.
          We will also obtain personal information from reputable third parties.
          <br />
          ​<br />
          <br />
          Personal information does not include “aggregate” information, which is data we collect about the use of
          the sites or categories of site users, from which any personal information has been removed. We collect
          aggregate data for a number of purposes, including improving the Service, to diagnose technical issues,
          to help identify user needs so that we can better consider new products and services, and to tailor
          existing products and services to better serve our users. This Privacy Policy in no way limits or
          restricts our collection, use or disclosure of aggregate information.
          <br />
          <br />
          <br />
          How We Collect and Use information
          <br />
          We collect the following types of information:
          <br />
          - Information you provide. When you willingly provide personal information, such as your email address or
          phone number, in exchange for a brand offer or reward, or we ask you for personal information. Similarly,
          when you provide your opinion in response to a survey question, we may match it to an IP address even
          where not associated with a specific name. We combine the information you submit under your account or
          otherwise voluntarily with information from other BWI services or third parties in order to provide you
          with a better experience and to improve the quality of our services. For certain services, we give you
          the opportunity to opt out of combining such information.
          <br />
          - Cookies. When you visit a BWI-enabled webpage, we send one or more cookies to your computer or other
          device. We use cookies to improve the quality of our service, including for storing user preferences,
          improving products and ad selection, and tracking user trends, such as how people use our services.
          <br />
          - Log information. When you access BWI services via a browser, application or other client our servers
          automatically record certain information. These server logs include information such as your web request,
          your interaction with a service, Internet Protocol address, browser type, browser language, the date and
          time of your request and one or more cookies that uniquely identify your browser.
          <br />
          Affiliated BWI Services on other sites. We offer our services on or through other websites. Personal
          information that you provide to those sites will be sent to BWI in order to deliver the service. We
          process such information under this Privacy Policy.
          <br />
          Third Party Applications. BWI will make available third party applications, such as mobile applications,
          gadgets or extensions, through its services. The information collected by BWI when you enable a third
          party application is processed under this Privacy Policy. Information collected by the third party
          application provider is governed by their privacy policies.
          <br />
          Location data. BWI will offer location-enabled services, sometimes part of another provider, to its
          brands. If you use those services, BWI will receive information about your actual location (such as GPS
          signals sent by a mobile device) or information that can be used to approximate a location (such as a
          cell ID).
          <br />
          Unique application number. Certain services include a unique application number that is not associated
          with your account or you. This number and information about your installation (e.g., operating system
          type, version number) will be sent to BWI when you install or uninstall that service or when that service
          periodically contacts our servers (for example, to request automatic updates to the software).
          <br />
          <br />
          <br />
          In addition to the above, we will use the information we collect to:
          <br />
          Provide, maintain, protect, and improve our services (including advertising services) and develop new
          services.
          <br />
          We also engage in general profiling based on the personal information we process on behalf of the brands
          who use our services and use automated decision-making or profiling to help tailor the offers that you
          receive from them. However, this processing does not result in legal or other significant effects.
          <br />
          <br />
          <br />
          How We Share Information
          <br />
          Like many businesses, we sometimes hire third party vendors to perform certain business-related functions
          on our behalf, such as hosting specific portions of the Service, maintaining databases, delivering
          content, sending emails, administering contents, mailing information, processing payments, or otherwise
          operating the Services. When we employ a third party vendor to perform these functions, that third party
          vendor will only be provided with the particular personal information or aggregate information it needs
          to perform its function, and is required to protect such Personal Data and/or Aggregate Data.
          <br />
          ​<br />
          <br />
          In addition, we enter into relationships with brands, advertising partners, networks who provide services
          to you, sell items or provide promotions to you. BWI can provide personal information and/or aggregate
          information to those partners for remarketing purposes and for monitoring performance metrics.
          <br />
          We share information that has been anonymized or aggregates without limitation.
          <br />
          <br />
          <br />
          GDPR & CCPA
          <br />
          This section applies to those that visit the Services from the European Economic Area , Switzerland and
          the UK (Covered under GDPR) or California (Covered under CCPA)
          <br />
          ​<br />
          <br />
          As described in this Privacy Policy, we may obtain personal information collected through the Services
          from, or on behalf of, brands who use our Services. In this respect, we act as a processor for those
          brands, which have their own privacy policies that describe how they use information. To the extent that
          BWI is processing your personal Information on behalf of a brand in our role as a processor, please reach
          out to that brand directly to exercise any of your rights under local data protection laws.
          <br />
          ​<br />
          <br />
          BWI is a data controller with regard to personal information collected from individuals using our site
          from the above mentioned regions. This section applies to our processing of such site user personal
          information under GDPR and CCPA.
          <br />
          <br />
          <br />
          Lawful Basis for Processing
          <br />
          BWI processes personal information with your consent (e.g., when you agree that BWI may place cookies, or
          when BWI processes personal information submitted to the Services for specified purposes).
          <br />
          ​<br />
          <br />
          On other occasions, BWI may process personal information when it needs to do this to fulfil a contract
          (for example, for billing purposes) or where required to do this by law.
          <br />
          ​<br />
          <br />
          If necessary, BWI may also process personal information when it is in BWI’s legitimate interests to do
          this (e.g., for customer service or fraud detection) and when these interests are not overridden by your
          data protection rights.
          <br />
          <br />
          <br />
          Transfers of Personal Information
          <br />
          Please be aware that the personal information we collect may be transferred to and maintained on servers
          or databases located outside your state, province, country, or other jurisdiction, where the privacy laws
          may not be as protective as those in your location. If you are located outside of the United States,
          please be advised that we process and store personal information in the United States and your consent to
          this privacy notice represents your agreement to this processing.
          <br />
          <br />
          <br />
          Your Rights
          <br />
          You have a right to the following:
          <br />
          - To request access to the personal information we hold about you;
          <br />
          - To request that we rectify or erase your personal information;
          <br />
          - To request that we restrict or block the processing of your personal information;
          <br />
          - Under certain circumstances, to receive personal information about you that we store and transmit to
          another without hindrance from us, including requesting that we provide your personal information
          directly to another, i.e., a right to data portability; and
          <br />
          - Where we previously obtained your consent, to withdraw consent to processing your personal information.
          <br />
          <br />
          <br />
          To exercise these rights, see the “Contact” section above. Please be aware that BWI may be unable to
          afford these rights to you under certain circumstances, such as if we are legally prevented from doing
          so.
          <br />
          Additionally, you have the right to lodge a complaint against us. To do so, contact the supervisory
          authority in your country of residence.
          <br />
          <br />
          <br />
          Links to Other Sites
          <br />
          Please note that, while using the Services, you could be directed to other sites that are developed and
          administered by people or companies not affiliated with or controlled by BWI. These other sites may place
          their own cookies on your computer, collect data or solicit personal information.
          <br />
          We suggest that when you link to another site you review that site’s privacy policy, as it may be
          different from this Privacy Policy. BWI is not responsible for the actions of those people or companies,
          the content of their sites, the use of information you provide to them, or any products or services they
          may offer. Our link to those sites does not constitute our sponsorship of, or affiliation with, those
          people or companies.
          <br />
          <br />
          <br />
          How We Protect Your Personal Information
          <br />
          BWI Services uses reasonable efforts to protect your personal information against unauthorized access and
          unauthorized alteration, disclosure or destruction.
          <br />
          <br />
          <br />
          Retention
          <br />
          BWI will retain your personal information for the period necessary to fulfill the purposes outlined in
          this Privacy Policy unless a longer retention period is required or permitted by law. The criteria used
          to determine the period of storage of personal information is the respective statutory retention period.
          After expiration of that period, the corresponding data is routinely deleted, as long as it is no longer
          necessary for the fulfillment of a contract or the initiation of a contract.
          <br />
          <br />
          <br />
          Child-specific terms
          <br />
          BWI understands that children’s privacy is important. We encourage parents and legal guardians to spend
          time with their age-appropriate children using the Services to be fully familiar with the Service
          features. By using or logging into the Service, we may ask users for their age. By using or logging into
          the Service or related features, you agree to respond truthfully and accurately about your age.
          <br />
          <br />
          <br />
          Children Under the Age of 16: The Service is prohibited to children under the age of 16. We will not
          knowingly collect or use personal information from anyone under 16 years of age. Children under the age
          of 16 years of age are expressly prohibited from submitting or posting any personal information on the
          Service.
          <br />
          <br />
          <br />
          Changes to this Privacy Policy
          <br />
          We may change this Privacy Policy at any time. We will post all changes to this Privacy Policy on this
          page and will indicate at the top of the page the modified policy’s effective date. We therefore
          encourage you to refer to this page on an ongoing basis so that you are aware of our current Privacy
          Policy.
          <br />
          <br />
          <br />
          Contact Us
          <br />
          If you have any questions or suggestions regarding this Privacy Policy, please contact us in our role as
          controller, at info@bellwetherinsight.com
          <br />
          <br />
          <br />
          For visitors from the European Economic Area, Switzerland, UK (under GDPR), or California (Under CCPA),
          please email our Data Protection Officer, at info@bellwetherinsight.com
        </InfoOverlay>
      )}
    </div>
  )
}

const Bar = styled.div`
  z-index: 1;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  position: relative;
  height: 50px;
  width: 100%;
  background: #08324c;
`

const Baseline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const Header = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  user-select: none;
`

const Logo = styled.img`
  height: 36px;
  margin-right: 30px;
  vertical-align: middle;

  @media (min-width: 430px) {
    display: none;
  }
`

const InfoButton = styled.img`
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
  cursor: pointer;
`

const InfoOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100vw - 80px);
  height: calc(100vh - 80px);
  background-color: white;
  padding: 40px;
  overflow: auto;
`
