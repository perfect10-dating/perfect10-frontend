import RangeSlider from "rsuite/RangeSlider";
import "rsuite/dist/rsuite.css"
import {useState} from "react";

interface PropTypes {
    userAge: number
    default: AgeRange
    limits: {min: number, max: number}
    onChange: (range: AgeRange) => void
}

export function AgeRange(props: PropTypes) {
    const [internalAgeRange, setInternalAgeRange] = useState(props.default)

    return (
        <div style={{padding: 10}}>
            <div style={{fontSize: 12, marginBottom: 10}}>
                Select an age range for your partners
            </div>
            <div>
                <RangeSlider
                    defaultValue={[props.default.min, props.default.max]}
                    min={props.limits.min}
                    max={props.limits.max}
                    step={Math.floor((props.limits.max - props.limits.min) / 8)}
                    graduated
                    progress
                    renderMark={mark => mark}
                    constraint={([start, end]) => (start >= 18 && end >= 18)}
                    onChange={(val) => {
                        props.onChange({min: val[0], max: val[1]})
                        setInternalAgeRange({min: val[0], max: val[1]})
                    }}
                />
                {
                    // if the user age is outside of the age range, warn them that is illegal
                    (props.userAge > internalAgeRange.max || props.userAge < internalAgeRange.min) &&
                    <div style={{color: "red", fontSize: 12}}>
                        Your age range must include your own age ({props.userAge})
                    </div>
                }
            </div>
        </div>
    )
}