import { MouseEvent, TouchEvent, useState } from 'react'
import styled from 'styled-components'
import { useAppDispatch } from '../../app/hooks'
import { usePostVoteMutation } from '../../services/api'
import { vote } from '../../services/surveySlice'

export function BooleanQuestion(props: { survey: Survey; question: Question; onVote: any }) {
  const [moving, setMoving] = useState<boolean>(false)
  const [mouseStart, setMouseStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [mouseDelta, setMouseDelta] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const { innerWidth: width } = window
  const threshold = (width * 1) / 3
  const dispatch = useAppDispatch()
  const [postVote] = usePostVoteMutation()

  function handleVote(voteValue: number): void {
    props.onVote && props.onVote(props.question, voteValue)
    if (!props.survey.previewMode) {
      postVote({
        survey: props.survey,
        question: props.question._id,
        choice: [props.question.choices[voteValue]],
        utm: window.location.search,
      }) // TODO: props.question.choices[voteValue].value
    }
    dispatch(vote(voteValue))
  }

  function mouseDown(e: MouseEvent): void {
    // e.preventDefault()
    setMoving(true)
    setMouseStart({ x: e.pageX, y: e.pageY })
  }

  function touchStart(e: TouchEvent): void {
    // e.preventDefault()
    setMoving(true)
    setMouseStart({ x: e.touches[0].pageX, y: e.touches[0].pageY })
  }

  function mouseMove(e: MouseEvent): void {
    // e.preventDefault()
    if (moving) setMouseDelta({ x: e.pageX - mouseStart.x, y: e.pageY - mouseStart.y })
  }

  function touchMove(e: TouchEvent): void {
    // e.preventDefault()
    if (moving) setMouseDelta({ x: e.touches[0].pageX - mouseStart.x, y: e.touches[0].pageY - mouseStart.y })
  }

  function mouseUp(e: MouseEvent): void {
    // e.preventDefault()
    // console.log(threshold)
    // console.log(Math.abs(mouseDelta.x))
    if (Math.abs(mouseDelta.x) > threshold) {
      handleVote(mouseDelta.x / Math.abs(mouseDelta.x) + 1)
    }
    setMouseDelta({ x: 0, y: 0 })
    setMoving(false)
  }

  function touchEnd(e: TouchEvent): void {
    // e.preventDefault()
    if (Math.abs(mouseDelta.x) > threshold) {
      handleVote(mouseDelta.x / Math.abs(mouseDelta.x) + 1)
    }
    setMouseDelta({ x: 0, y: 0 })
    setMoving(false)
  }

  return (
    <QuestionWrapper
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onMouseLeave={mouseUp}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
    >
      <Tile
        style={{ transform: `translate(${mouseDelta.x}px, 0px) rotate(${(mouseDelta.x / width) * 0.25 * 45}deg)` }}
      >
        <OpacityTop>
          <Prompt>{props.question.prompt}</Prompt>
        </OpacityTop>
        <OpacityBottom>
          <Engagements>
            <Engagement src={'/img/engagement_icons/no.png'} onClick={() => handleVote(0)} />
            <Engagement src={'/img/engagement_icons/not-sure.png'} onClick={() => handleVote(1)} />
            <Engagement src={'/img/engagement_icons/yes.png'} onClick={() => handleVote(2)} />
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
  overflow: hidden;
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
  padding: 40px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0px 0px 20px #000000;
  overflow-wrap: break-word;
`

const OpacityBottom = styled.div`
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
`

const Engagements = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 40px;

  @media (min-width: 430px) {
    padding-bottom: 20px;
  }
`

const Engagement = styled.img`
  height: 70px;
  cursor: pointer;
  user-select: none;
  user-drag: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
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

const Background = styled.div`
  position: absolute;
  width: 100%;
  min-width: 100%;
  min-height: 100%;
  user-select: none;
  pointer-events: none;
  z-index: -1;
  width: -webkit-fill-available;
  background-position: center;
  background-size: cover;
`
