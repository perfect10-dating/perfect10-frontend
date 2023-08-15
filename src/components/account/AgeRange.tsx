import RangeSlider from "rsuite/RangeSlider";
import "rsuite/dist/rsuite.css"

interface PropTypes {
    default: AgeRange
    onChange: (range: AgeRange) => void
}

export function AgeRange(props: PropTypes) {
    return (
        <div>
            <RangeSlider
                defaultValue={[props.default.min, props.default.max]}
                min={18}
                max={60}
                step={4}
                graduated
                progress
                renderMark={mark => mark}
                constraint={([start, end]) => (start >= 18 && end >= 18)}
                onChange={(val) => props.onChange({min: val[0], max: val[1]})}
            />
        </div>
    )
}