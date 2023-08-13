import {useState} from "react";
import {useReviewDateMutation} from "../../services/api";

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
                <div>Did your date show up?</div>
            </div>

            <div>
                <div>Did your date look like their photos?</div>
            </div>

            <div>
                <div>Did you feel safe around your date?</div>
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
                <div>Would you go on a second date with this person?</div>
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