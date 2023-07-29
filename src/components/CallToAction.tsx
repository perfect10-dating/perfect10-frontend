import { useRef, useState } from 'react'
import styled from 'styled-components'
import { usePostSurveyInteractionMutation } from '../services/api'

const STORAGE_NAMESPACE = 'bwi.' // local storage namespace

const appendUTMs = (url: string) => {
  // appends query (everything after '?' in the url) of the current url to the provided url, which it then returns for use during CTA handling
  if (!window.location.search) {
    return url
  }
  if (url.indexOf('?') === -1) {
    url += window.location.search
  } else {
    url += '&' + window.location.search.substring(1) // drop the '?' that window.location.search incudes before appending to url, and prepend an '&'
  }
  return url
}

interface CallToActionProps {
  survey: Survey
}

export const CallToAction = ({ survey }: CallToActionProps) => {
  const [formCTASubmitted, setFormCTASubmitted] = useState(false)
  const [formCTASubmissionPending, setFormCTASubmissionPending] = useState(false)
  const [postSurveyInteraction] = usePostSurveyInteractionMutation()
  const inputRefs = useRef<any>({})

  const delayedRedirect = (url: string, delay = 250) => {
    setTimeout(() => {
      window.location.href = appendUTMs(url)
    }, delay)
  }

  const handleCTAClick = (e: any, ctaUrl: string, redirectDelay?: number) => {
    if (e) {
      e.preventDefault()
    }
    postSurveyInteraction({ type: 'cta-click', survey: survey._id, utm: window.location.search })
    if (ctaUrl) {
      delayedRedirect(appendUTMs(ctaUrl), redirectDelay)
    }
  }

  const handleFormCTASubmission = (e: any) => {
    if (e) {
      e.preventDefault()
    }
    let inputs: any = {} // map of input field name to user input value, to be included in api payload
    for (let formInput of survey.callToAction?.form?.inputs || []) {
      if (!validateFormInput(formInput)) {
        return
      } else {
        let ref = inputRefs.current['_ref_' + formInput.name]
        if (ref && ref.value) {
          inputs[formInput.name] = ref.value.trim()
        }
      }
    }

    postSurveyInteraction({
      type: 'cta-submit',
      survey: survey._id,
      data: { ctaType: 'form', inputs },
      utm: window.location.search,
    })
    // this.context.getActions('SurveyActions').submitFormCTA(survey._id, inputs)
    // .then(() => {
    setFormCTASubmissionPending(false)
    setFormCTASubmitted(true)
    // this.handleCTAClick(e, null) // register cta click
    if (survey.callToAction?.redirect) {
      delayedRedirect(survey.callToAction.redirect, 1000)
    }
    // })
    // .catch(() => {
    //   alert('Unable to submit at this time')
    //   // todo: display error message?
    //   this.setState({ formCTASubmissionPending: false })
    // })
  }

  const validateFormInput = (formInput: any) => {
    // returns true if valid, else false. notifies user of any validation error
    try {
      let ref = inputRefs.current['_ref_' + formInput.name]

      if (!ref) {
        if (formInput.required) {
          alert('Missing required input: ' + formInput.displayName)
          return false
        } else {
          return true
        }
      }

      let inputText = ref.value.trim()
      if (!inputText) {
        if (formInput.required) {
          alert('Missing required input: ' + formInput.displayName)
          return false
        } else {
          return true
        }
      }

      switch (formInput.inputType) {
        case 'email':
          if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/.test(inputText)) {
            // validate email format
            return true
          } else {
            alert('Invalid email format')
            return false
          }
        default:
          return true
      }
    } catch (err) {
      alert('There was an error processing your submission')
      return false
    }
  }

  const copyShareableLink = () => {
    if (survey) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        // if this is the first time the user has clicked the share button, fire a 'share' event
        try {
          var localStorage = window.localStorage
          let shareEventKey = STORAGE_NAMESPACE + survey._id + '.share'
          if (!localStorage.getItem(shareEventKey)) {
            // this.context.getActions('SurveyActions').logSurveyInteraction(survey._id, 'share')
            localStorage.setItem(shareEventKey, '1')
          }
        } catch (e) {}
        alert('A shareable link to this survey has been copied to your clipboard')
      })
    }
  }

  const renderFormInput = (input: any, index: number) => {
    let inputType
    switch (input.inputType) {
      case 'paragraph':
        return (
          <>
            <InputLabel>
              {input.displayName}
              {input.required && <span style={{ marginLeft: 2, color: 'gray' }}>(required)</span>}
            </InputLabel>
            <InputTextarea
              ref={(el) => (inputRefs.current['_ref_' + input.name] = el)}
              name={input.name}
              placeholder='Enter text...'
            />
          </>
        )
      case 'email':
        inputType = 'email'
        break
      case 'phone':
        inputType = 'tel'
        break
      case 'checkbox':
        inputType = 'checkbox'
        break
      default:
        inputType = 'text'
        break
    }
    return (
      <div key={index}>
        <InputLabel>
          {input.displayName}
          {input.required && <span style={{ marginLeft: 2, color: 'gray' }}>(required)</span>}
        </InputLabel>
        <Input
          ref={(el) => (inputRefs.current['_ref_' + input.name] = el)}
          name={input.name}
          type={inputType}
          placeholder={input.displayName + '...'}
        />
      </div>
    )
  }

  const cta = survey.callToAction

  if (!cta) {
    return (
      <Page type={'none'}>
        <Text>Thanks for completing this survey!</Text>
      </Page>
    )
  }

  if (cta.type === 'redirect' && cta.redirect) {
    delayedRedirect(cta.redirect)
  }

  return (
    <Page type={cta.type} surveyBackground={survey.backgroundColor}>
      {cta.type === 'card' && cta.card ? (
        <Tile>
          <TileImageWrapper>
            <TileImage src={cta.card.image} />
          </TileImageWrapper>
          <Prompt>{cta.card.text}</Prompt>
          {cta.card.buttonUrl && (
            <a
              href={cta.card.buttonUrl}
              style={{ textDecoration: 'none' }}
              onClick={(e) => handleCTAClick(e, cta.card.buttonUrl)}
            >
              <Button>
                <span>{cta.card.buttonLabel}</span>
              </Button>
            </a>
          )}
        </Tile>
      ) : cta.type === 'redirect' ? (
        <div>
          <p style={{ marginTop: 60 }}>Redirecting...</p>
        </div>
      ) : cta.type === 'iframe' && cta.iframe ? (
        <IFrame>
          <iframe title='iframe' src={cta.iframe} />
        </IFrame>
      ) : cta.type === 'donate' && cta.donate ? (
        <IFrame
          style={{
            background: cta.donate.backgroundImage
              ? `url(${cta.donate.backgroundImage})`
              : cta.donate.backgroundColor || '#e0eeff',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            backgroundAttachment: 'fixed',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflow: 'auto',
          }}
        >
          <Donate>
            {cta.donate.image && <DonateImage src={cta.donate.image} />}
            <p
              style={{
                margin: 20,
                fontSize: '12pt',
                fontFamily: 'Futura, arial, helvetica, sans-serif',
                color: '#205381',
                backgroundColor: 'transparent',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              dangerouslySetInnerHTML={{ __html: cta.donate.text }}
            />
            <div
              style={{
                padding: 10,
                textAlign: 'center',
              }}
            >
              {cta.donate.donationAmounts.map((amount, index) => (
                <DonateLink
                  onlyShowLg={index > 1}
                  key={'donate-' + index}
                  href={cta.donate.buttonUrl + '?amount=' + amount}
                  onClick={(e) => handleCTAClick(e, cta.donate.buttonUrl + '?amount=' + amount)}
                >
                  <AmountNoDescription>
                    <AmountOption optionBackground={cta.donate.buttonColor}>${amount}</AmountOption>
                  </AmountNoDescription>
                </DonateLink>
              ))}
              <a
                key='donate-custom'
                href={cta.donate.buttonUrl}
                onClick={(e) => handleCTAClick(e, cta.donate.buttonUrl)}
              >
                <AmountNoDescription>
                  <AmountOption optionBackground={cta.donate.buttonColor}>Custom</AmountOption>
                </AmountNoDescription>
              </a>
            </div>
          </Donate>
        </IFrame>
      ) : cta.type === 'form' && cta.form ? (
        <IFrame
          style={{
            background: cta.form.backgroundImage
              ? `url(${cta.form.backgroundImage})`
              : cta.form.backgroundColor || 'linear-gradient(45deg, rgb(22, 94, 139), rgb(129, 203, 227))', // #e0eeff
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            backgroundAttachment: 'fixed',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflow: 'auto',
          }}
        >
          <Donate>
            {cta.form.image && <DonateImage src={cta.form.image} />}
            <p
              style={{
                margin: '20px auto 30px',
                fontSize: '12pt',
                fontFamily: 'Futura, arial, helvetica, sans-serif',
                color: '#205381',
                backgroundColor: 'transparent',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              dangerouslySetInnerHTML={{
                __html: !formCTASubmitted ? cta.form.text : cta.form.feedback || 'Thank you for getting in touch!',
              }}
            />
            {!formCTASubmitted && (
              <div>
                <div
                  style={{
                    padding: '0 30px',
                    textAlign: 'center',
                  }}
                >
                  {cta.form.inputs.map((input, index) => renderFormInput(input, index))}
                </div>

                {cta.form.legal && (
                  <p
                    style={{
                      color: '#555',
                      fontSize: 10,
                      textAlign: 'justify',
                      padding: '0px 30px',
                    }}
                  >
                    {cta.form.legal}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 30px 30px',
                  }}
                >
                  {cta.redirect && (
                    <Button
                      style={{
                        width: '40%',
                        backgroundColor: '#697a8b', // cta.form.button.backgroundColor,
                        color: cta.form.button.color || 'white',
                        cursor: formCTASubmissionPending ? 'not-allowed' : 'pointer',
                        margin: 0,
                        fontSize: 16,
                      }}
                      onClick={(e) => handleCTAClick(e, cta.redirect, 250)}
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    style={{
                      width: '40%',
                      backgroundColor: '#527293', // cta.form.button.backgroundColor,
                      color: cta.form.button.color || 'white',
                      cursor: formCTASubmissionPending ? 'not-allowed' : 'pointer',
                      margin: 0,
                      fontSize: 16,
                    }}
                    onClick={handleFormCTASubmission}
                  >
                    {cta.form.button.text}
                  </Button>
                </div>
              </div>
            )}
          </Donate>
        </IFrame>
      ) : (
        <RefreshButton>
          {survey.creatorInfo && survey.creatorInfo.backdropImage ? (
            <img
              alt='backdrop'
              style={{
                width: 300,
                height: 300,
                marginTop: 25,
                borderRadius: 20,
              }}
              src={survey.creatorInfo.backdropImage}
            />
          ) : (
            <img
              alt='backdrop'
              style={{
                width: 150,
                height: 150,
                marginTop: 25,
                marginBottom: 20,
                borderRadius: 20,
                opacity: 0,
              }}
              src={undefined}
            />
          )}
          <Text>
            Thanks for completing this survey!
            <br />
            <br />
            {navigator && navigator.clipboard && (
              <span>Click the button below to copy a shareable link to this survey.</span>
            )}
          </Text>
          {navigator && navigator.clipboard && (
            <SocialMediaContainer onClick={copyShareableLink}>
              <p style={{ padding: 10 }}>Share this survey</p>
            </SocialMediaContainer>
          )}
        </RefreshButton>
      )}
      {/* {survey && survey.paidForBy && <div className="paid-for-by"><p>{survey.paidForBy}</p></div>} */}
    </Page>
  )
}

interface PageProps {
  type: string
  surveyBackground?: string
}

const Page = styled.div<PageProps>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.surveyBackground || '#ffffff'};
  overflow: ${(props) => (props.type === 'iframe' ? 'hidden' : 'auto')};
  z-index: ${(props) => (props.type === 'iframe' ? '1' : '0')};
`

const Tile = styled.div`
  background: #002868;
  border-radius: 15px;
  box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 999;
  transition: 300ms opacity ease;

  @media (max-width: 499px) {
    width: 80vw;
  }

  @media (min-width: 500px) {
    width: 400px;
  }
`

const TileImageWrapper = styled.div`
  position: 'relative';
  @media (max-width: 499px) {
    width: 80vw;
  }

  @media (min-width: 500px) {
    width: 400px;
  }
`

const TileImage = styled.img`
  width: 100%;
`

const Prompt = styled.div`
  color: #ffffff;
  font-family: 'Futura';
  position: relative;
  text-align: left;
  margin: 20px;
  font-size: 18px;

  @media (max-width: 499px) {
    margin: 10px 15px;
    font-size: 14px;
  }
`

const InputLabel = styled.p`
  text-align: left;
  font-size: 12px;
  color: #444;
  margin-bottom: 4px;
`

const InputTextarea = styled.textarea`
  width: calc(100% - 22px);
  margin-bottom: 15px;
  padding: 6px 10px;
  border: 1px solid #aaa;
  border-radius: 2px;
  color: #424242;
  outline: none !important;
  /* resize: none; */
  resize: vertical;
  font-family: unset;
`

const Input = styled.input`
  width: calc(100% - 22px);
  margin-bottom: 15px;
  padding: 6px 10px;
  border: 1px solid #aaa;
  border-radius: 2px;
  color: #424242;
  outline: none !important;
  /* resize: none; */
  resize: vertical;
  font-family: unset;
`

const IFrame = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  -webkit-overflow-scrolling: touch;
`

const Donate = styled.div`
  margin-top: 40px;
  margin-bottom: 60px;
  border-radius: 15px;
  text-align: center;
  background: white;
  box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.25);
  z-index: 999;
  transition: 300ms opacity ease;

  @media (max-width: 499px) {
    width: 80vw;
    margin-bottom: 20px;
  }

  @media (min-width: 500px) {
    width: 480px;
  }
`

const DonateLink = styled.a<{ onlyShowLg: boolean }>`
  @media (max-width: 499px) {
    display: default;
  }

  @media (min-width: 500px) {
    display: ${(props) => (props.onlyShowLg ? 'none' : 'default')};
  }
`

const DonateImage = styled.img`
  max-width: calc(100% - 40px);
  max-height: 250px;
  margin: 30px auto 10px auto;
  border-radius: 4px;
`

const AmountNoDescription = styled.div`
  display: inline-block;
  width: calc(100% - 20px);
  padding: 0 10px;
  text-align: center;
  cursor: pointer;

  @media (min-width: 500px) {
    width: calc(50% - 20px);
  }
`

const AmountOption = styled.div<{ optionBackground: string }>`
  box-shadow: 3px 3px 10px 0 rgb(19 56 121 / 10%);
  border-radius: 4px;
  color: #fff;
  border: 0;
  width: 100%;
  margin-bottom: 16px;
  background-color: ${(props) => props.optionBackground || '#697a8b'};
  padding: 14px 0;
`

const Button = styled.p`
  background-color: #36ab40;
  border-radius: 8px;
  padding: 15px 0;
  width: calc(100% - 70px);
  font-size: 20px;
  color: white;
  box-shadow: 0px 4px 5px -2px rgb(0 0 0 / 25%);
  font-weight: 500;
  letter-spacing: 1px;
  position: relative;
  margin: 30px auto;
  cursor: pointer;
  text-align: center;

  @media (max-width: 499px) {
    margin: 20px auto;
  }
`

const RefreshButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const Text = styled.p`
  color: var(--blue);
  font-size: 24;
  font-weight: 600;
  text-align: 'center';
`

const SocialMediaContainer = styled.div`
  width: 300px;
  height: 60;
  margin: 20px auto;
  padding: 0px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: dodgerblue;
  color: white;
  border-radius: 30px;
  width: max-content;
`
