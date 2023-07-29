import { useState } from 'react'
import styled from 'styled-components'
import { vote } from '../../services/surveySlice'
import { useAppDispatch } from '../../app/hooks'
import { usePostVoteMutation } from '../../services/api'

export function Rate(props: { survey: Survey; question: Question; onVote: any }) {
  const dispatch = useAppDispatch()
  const [rating, setRating] = useState<number>(50)
  const [postVote] = usePostVoteMutation()

  function handleVote() {
    props.onVote && props.onVote(props.question)
    let quantizedRating = Math.floor(rating / 20)
    if (!props.survey.previewMode) {
      postVote({
        survey: props.survey,
        question: props.question._id,
        choice: [{ value: quantizedRating, label: '' }],
        utm: window.location.search,
      })
    }
    dispatch(vote(quantizedRating))
  }

  return (
    <QuestionWrapper>
      <Tile>
        <OpacityTop>
          <Prompt>{props.question.prompt}</Prompt>
        </OpacityTop>
        <OpacityBottom>
          <Engagements>
            <Slider
              type="range"
              min={1}
              max={99}
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <RateLabels>
              <p style={{ width: '35%', marginRight: '15%', textAlign: 'left' }}>
                {props.question.choices[0]?.label || ''}
              </p>
              <p style={{ width: '35%', marginLeft: '15%', textAlign: 'right' }}>
                {props.question.choices[1]?.label || ''}
              </p>
            </RateLabels>
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
  width: 100%;
  height: 100%;
  user-select: none;
  user-drag: none;
  box-shadow: 0px 2px 10px -2px #0008;
  // border: 1px solid #00000047;

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0 40px 0;
`

const Slider = styled.input.attrs({ type: 'range' })`
  background-color: blue;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  // opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  height: 12px;
  border-radius: 20px;
  width: calc(100% - 80px);
  margin-bottom: 20px;
  background: linear-gradient(
    90deg,
    rgb(0, 0, 255) 1%,
    rgb(226, 204, 223) 45%,
    rgb(229, 183, 199) 55%,
    rgb(255, 0, 0) 100%
  );
  z-index: 2;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 35px;
    height: 35px;
    border-radius: 35px;
    outline: none;
    background: white;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 35px;
    height: 35px;
    border-radius: 35px;
    outline: none;
    background: white;
    cursor: pointer;
  }
`

const RateLabels = styled.div`
  width: calc(100% - 80px);
  font-weight: 900;
  font-size: 14px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0px;
  margin-bottom: 10px;
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

const Background = styled.div`
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  z-index: -1;
  width: -webkit-fill-available;
  background-position: center;
  background-size: cover;
`
