import {useState} from "react";
import {useReviewDateMutation} from "../../services/api";
import {Slider, Toggle} from "rsuite";
const DEFAULT_SLIDER_VALUE = 5.5
const MIN_SLIDER_VALUE = 1
const MAX_SLIDER_VALUE = 10

interface PropTypes {
    user: User
}
export function DateReview(props: PropTypes) {
    const [wasNoShow, setWasNoShow] = useState(false)
    const [wasCatfish, setWasCatfish] = useState(false)
    const [wasThreatening, setWasThreatening] = useState(false)
    const [intelligent, setIntelligent] = useState(DEFAULT_SLIDER_VALUE)
    const [trustworthy, setTrustworthy] = useState(DEFAULT_SLIDER_VALUE)
    const [attractive, setAttractive] = useState(DEFAULT_SLIDER_VALUE)
    const [pleasant, setPleasant] = useState(DEFAULT_SLIDER_VALUE)
    const [satisfied, setSatisfied] = useState(DEFAULT_SLIDER_VALUE)
    const [secondDate, setSecondDate] = useState(false)

    const [reviewDate] = useReviewDateMutation()

    let lockingDate = (props.user.lockingDate as PopulatedDate)
    let isSetup = lockingDate.isSetup
    let otherUser = lockingDate.setupResponsibleUser
    if (!otherUser) {
        for (let userMini of lockingDate.users) {
            if (userMini._id+"" !== props.user._id+"") {
                otherUser = userMini
                break
            }
        }
    }

    return (
        <div>
            <div>Please review your date with {(otherUser as UserMini).firstName}{isSetup ? "'s friend" : ""}</div>

            <div>
                <label>
                    <Toggle
                        defaultChecked={!wasNoShow}
                        onChange={() => {
                            setWasNoShow(!wasNoShow)
                        }}
                    />
                    <span>Did your date show up?</span>
                </label>
            </div>

            <div>
                <label>
                    <Toggle
                        defaultChecked={!wasCatfish}
                        onChange={() => {
                            setWasCatfish(!wasCatfish)
                        }}
                    />
                    <span>Did your date look like their photos?</span>
                </label>
            </div>

            <div>
                <label>
                    <Toggle
                        defaultChecked={!wasThreatening}
                        onChange={() => {
                            setWasThreatening(!wasThreatening)
                        }}
                    />
                    <span>Did you feel safe around your date?</span>
                </label>
            </div>

            <div>
                <div>How intelligent did you find your date?</div>
                <Slider
                    defaultValue={intelligent}
                    min={MIN_SLIDER_VALUE}
                    max={MAX_SLIDER_VALUE}
                    graduated
                    progress
                    renderMark={mark => mark}
                    onChange={(val) => setIntelligent(val)}
                />
            </div>

            <div>
                <div>How trustworthy did you find your date?</div>
                <Slider
                    defaultValue={trustworthy}
                    min={MIN_SLIDER_VALUE}
                    max={MAX_SLIDER_VALUE}
                    graduated
                    progress
                    renderMark={mark => mark}
                    onChange={(val) => setTrustworthy(val)}
                />
            </div>

            <div>
                <div>How attractive did you find your date?</div>
                <Slider
                    defaultValue={attractive}
                    min={MIN_SLIDER_VALUE}
                    max={MAX_SLIDER_VALUE}
                    graduated
                    progress
                    renderMark={mark => mark}
                    onChange={(val) => setAttractive(val)}
                />
            </div>

            <div>
                <div>How satisfied were you with your date overall?</div>
                <Slider
                    defaultValue={satisfied}
                    min={MIN_SLIDER_VALUE}
                    max={MAX_SLIDER_VALUE}
                    graduated
                    progress
                    renderMark={mark => mark}
                    onChange={(val) => setSatisfied(val)}
                />
            </div>

            <div>
                <label>
                    <Toggle
                        defaultChecked={secondDate}
                        onChange={() => {
                            setSecondDate(!secondDate)
                        }}
                    />
                    <span>Would you go on a second date with this person?</span>
                </label>
            </div>

            <div onClick={() => {
              let review: DateReview = {
                  reviewee: (otherUser as UserMini)._id, dateObject: lockingDate._id,
                  wasNoShow, wasCatfish, wasThreatening,
                  intelligent, trustworthy, attractive, pleasant, satisfied, secondDate,
              }

              reviewDate({cognitoId: props.user.cognitoId, review})
            }}>
                {"Finish the survey >>"}
            </div>
        </div>
    )
}