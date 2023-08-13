import {useState} from "react";
import {useReviewDateMutation} from "../../services/api";
import Toggle from 'react-toggle'

interface PropTypes {
    user: User
}
export function DateReview(props: PropTypes) {
    const [wasNoShow, setWasNoShow] = useState(false)
    const [wasCatfish, setWasCatfish] = useState(false)
    const [wasThreatening, setWasThreatening] = useState(false)
    const [intelligent, setIntelligent] = useState(5.5)
    const [trustworthy, setTrustworthy] = useState(5.5)
    const [attractive, setAttractive] = useState(5.5)
    const [pleasant, setPleasant] = useState(5.5)
    const [satisfied, setSatisfied] = useState(5.5)
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
            </div>

            <div>
                <div>How trustworthy did you find your date?</div>
            </div>

            <div>
                <div>How attractive did you find your date?</div>
            </div>

            <div>
                <div>How satisfied were you with your date overall?</div>
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