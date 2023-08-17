import {useState} from "react";
import Toggle from "rsuite/Toggle";

interface PropTypes {
    initialShortTerm: boolean
    shortTermCallback: () => void
}

export const ShortTerm = (props: PropTypes) => {
    return (
        <div style={{margin: "20px auto", marginTop: 30, width: "80%"}}>
            <div style={{marginTop: 10}}>
                <label style={{display: "flex"}}>
                    <Toggle
                        defaultChecked={props.initialShortTerm}
                        onChange={() => props.shortTermCallback()}
                    />

                    <div style={{marginLeft: 5, marginTop: -8}}>
                                    I'm primarily interested in short-term relationships instead of long-term relationships
                                </div>
                </label>
            </div>
        </div>
    )
}
