import { useState } from 'react'
import styled from 'styled-components'
import { vote } from '../../services/surveySlice'
import { useAppDispatch } from '../../app/hooks'
import { usePostVoteMutation } from '../../services/api'

export function Rank(props: { survey: Survey; question: any; onVote: any }) {
  const [rank, setRank] = useState<Choice[]>([])
  const dispatch = useAppDispatch()
  const [postVote] = usePostVoteMutation()

  function handleVote(submittedRank: any) {
    if (submittedRank.length < props.question.choices.length) {
      alert('Please rank all choices')
      return
    }
    props.onVote && props.onVote(props.question)
    setRank([])
    if (!props.survey.previewMode) {
      postVote({
        survey: props.survey,
        question: props.question._id,
        choice: submittedRank,
        utm: window.location.search,
      })
    }
    dispatch(vote(submittedRank[0].value))
  }

  return (
    <QuestionWrapper>
      <Tile>
        <Prompt>{props.question.prompt}</Prompt>
        <Choices>
          {props.question.choices.map((choice: any, index: any) => {
            return <Choice key={index} choice={choice} choiceCount={props.question.choices.length} />
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

  function Choice(props: { choice: Choice; choiceCount: number }) {
    let currentRank = rank.indexOf(props.choice) === -1 ? null : rank.indexOf(props.choice) + 1
    return (
      <ChoiceContainer
        onClick={() => {
          const submittedRank = currentRank
            ? rank.filter((choice) => choice !== props.choice)
            : [...rank, props.choice]
          const complete = submittedRank.length >= props.choiceCount
          setRank(submittedRank)
          if (complete) {
            setTimeout(() => handleVote(submittedRank), 250)
          }
        }}
      >
        <ChoiceImageContainer>
          <ChoiceImage src={props.choice.image?.url} />
          <ChoiceOverlay selected={!!currentRank}>{currentRank}</ChoiceOverlay>
        </ChoiceImageContainer>
        <ChoiceLabel>{props.choice.label}</ChoiceLabel>
      </ChoiceContainer>
    )
  }
}

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;

  @media (min-width: 430px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

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
  background: #08324c;
  overflow-y: scroll;
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

const Prompt = styled.div`
  padding: 40px 40px 0px 40px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0px 0px 20px #000000;
  overflow-wrap: break-word;
`

const Choices = styled.div`
  padding: 0px;
`

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px 0px;
  width: calc(100% - 80px);
  padding: 6px 40px;
  color: #ffffff;
  transition: all 0.25s;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    color: #08324c;
  }
`

const ChoiceImageContainer = styled.div`
  position: relative;
  height: 72px;
`

const ChoiceImage = styled.img`
  align-self: center;
  height: 68px;
  min-height: 68px;
  max-height: 68px;
  width: 68px;
  min-width: 68px;
  max-width: 68px;
  border-radius: 40px;
  border: solid 2px #ffffff;
  margin: 0;
  padding: 0;
`

const ChoiceOverlay = styled.div<Selectable>`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 36px;
  background: ${(props) => (props.selected ? 'rgba(255,255,255,0.7)' : 'none')};
  color: #08324c;
  font-size: 30px;
  font-weight: 800;
`

const ChoiceLabel = styled.div`
  font-weight: 500;
  font-size: 18px;
  margin-left: 20px;
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
