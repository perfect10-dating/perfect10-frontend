import { useState } from 'react'
import styled from 'styled-components'
import { vote } from '../../services/surveySlice'
import { useAppDispatch } from '../../app/hooks'
import { usePostVoteMutation } from '../../services/api'

export function FreeResponseQuestion(props: { survey: Survey; question: Question; onVote: any }) {
  const dispatch = useAppDispatch()
  const [postVote] = usePostVoteMutation()
  const [textInput, setTextInput] = useState<string>('')

  function handleVote() {
    props.onVote && props.onVote(props.question)
    if (!props.survey.previewMode) {
      postVote({
        survey: props.survey,
        question: props.question._id,
        choice: [{ value: -1, label: textInput }],
        utm: window.location.search,
      })
    }
    dispatch(vote(-1))
  }

  return (
    <QuestionWrapper>
      <Tile>
        <OpacityTop>
          <Prompt>{props.question.prompt}</Prompt>
        </OpacityTop>
        <TextInput
          placeholder={'Type your thoughts here...'}
          onChange={(event) => setTextInput(event.target.value)}
        />
        <OpacityBottom>
          <Engagements>
            <Submit onClick={handleVote}>Skip</Submit>
            <Submit onClick={handleVote}>Submit</Submit>
          </Engagements>
          {props.survey.paidForBy && <MobilePaidForBy>{props.survey.paidForBy}</MobilePaidForBy>}
        </OpacityBottom>
        <Background style={{ backgroundImage: `url(${props.question.image?.url})` }} />
      </Tile>
      {props.survey.paidForBy && (
        <DesktopPaidForByWrapper>
          <DesktopPaidForBy>{props.survey.paidForBy}</DesktopPaidForBy>
        </DesktopPaidForByWrapper>
      )}
    </QuestionWrapper>
  )
}

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 429px) {
    height: 100%;
  }
`

const Tile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
  user-drag: none;
  box-shadow: 0px 2px 10px -2px #0008;

  @media (min-width: 430px) {
    width: 390px;
    height: 610px;
    margin-bottom: 60px;
  }

  @media (max-width: 429px) {
    width: 100%;
    height: 100%;
  }
`

const OpacityTop = styled.div`
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
`

const Prompt = styled.div`
  padding: 40px 40px 0px 40px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0px 0px 20px #000000;
  overflow-wrap: break-word;
`

const TextInput = styled.textarea`
  width: calc(100% - 80px);
  margin-left: 20px;
  padding: 20px;
  font-family: Montserrat;
  font-size: 20px;
  height: 400px;
  font-weight: 500;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  outline: none;
  border: none;
  resize: none;

  @media (min-width: 430px) {
    height: 240px;
  }
`

const OpacityBottom = styled.div`
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
`

const Engagements = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 20px 0 40px 0;
`

const Background = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  width: -webkit-fill-available;
  background-position: center;
  background-size: cover;
`

const Submit = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
  padding: 7px 14px;
  border: solid 2px #ffffff;
  transition: all 0.25s;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    color: #08324c;
  }
`

const MobilePaidForBy = styled.p`
  color: white;
  margin: -20px 10px 10px 10px;
  text-align: center;
  font-size: 8px;

  @media (min-width: 430px) {
    display: none;
  }
`

const DesktopPaidForByWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: -1;

  @media (max-width: 429px) {
    display: none;
  }
`

const DesktopPaidForBy = styled.p`
  margin: 10px;
  padding: 4px 8px;
  text-align: center;
  font-size: 10px;
  color: #333;
  border: 1px solid gray;
`
