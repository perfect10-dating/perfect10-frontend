import { useState } from 'react'
import styled from 'styled-components'
import { vote } from '../../services/surveySlice'
import { useAppDispatch } from '../../app/hooks'
import { usePostVoteMutation } from '../../services/api'

export function ImageChoice(props: { survey: Survey; question: any; onVote: any }) {
  const [choice, setChoice] = useState<number>(-1)
  const dispatch = useAppDispatch()
  const [postVote] = usePostVoteMutation()

  function handleVote(choiceValue: any) {
    if (choiceValue === -1) {
      return alert('Please tap a choice to select')
    }
    props.onVote && props.onVote(props.question, choiceValue)
    if (!props.survey.previewMode) {
      postVote({
        survey: props.survey,
        question: props.question._id,
        choice: props.question.choices[choiceValue],
        utm: window.location.search,
      })
    }
    setChoice(-1)
    dispatch(vote(choiceValue))
  }

  return (
    <QuestionWrapper>
      <Tile>
        <Prompt>{props.question.prompt}</Prompt>
        <Choices>
          {props.question.choices.map((choice: Choice, index: any) => {
            return <Choice key={index} choice={choice} />
          })}
        </Choices>
        <Engagements>{/* <Submit onClick={handleVote}>Submit</Submit> */}</Engagements>
        {props.survey.paidForBy && <MobilePaidForBy>{props.survey.paidForBy}</MobilePaidForBy>}
      </Tile>
      {props.survey.paidForBy && (
        <DesktopPaidForByWrapper>
          <DesktopPaidForBy>{props.survey.paidForBy}</DesktopPaidForBy>
        </DesktopPaidForByWrapper>
      )}
    </QuestionWrapper>
  )

  function Choice(props: { choice: Choice }) {
    return (
      <ChoiceContainer
        selected={props.choice.value === choice}
        onClick={() => {
          const choiceValue = choice === props.choice.value ? -1 : props.choice.value
          setChoice(choiceValue)
          setTimeout(() => handleVote(choiceValue), 250)
        }}
      >
        <ChoiceImage src={props.choice.image?.url} />
      </ChoiceContainer>
    )
  }
}

const QuestionWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  @media (min-width: 430px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const Tile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
  user-drag: none;
  background: #08324c;
  overflow-y: scroll;
  box-shadow: 0px 2px 10px -2px #0008;

  @media (min-width: 430px) {
    width: 390px;
    height: 610px;
  }
  @media (max-width: 429px) {
    width: 100%;
    height: 100%;
  }
`

const Prompt = styled.div`
  padding: 40px 40px 20px 40px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0px 0px 20px #000000;
  overflow-wrap: break-word;
`

const Choices = styled.div`
  margin-bottom: -4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`

const ChoiceContainer = styled.div<Selectable>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(50% - 4px);
  aspect-ratio: 1;
  background: ${(props) => (props.selected ? '#ffffff' : '#08324C')};
  border: solid 2px #ffffff;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    color: #08324c;
  }
`

const ChoiceImage = styled.img`
  height: 98%;
  width: 98%;
`

const Engagements = styled.div`
  display: block;
  width: max-content;
  flex-direction: row;
  justify-content: center;
  padding: 20px 0 40px 0;
  margin: 0 auto;
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
