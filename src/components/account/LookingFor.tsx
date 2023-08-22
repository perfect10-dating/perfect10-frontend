import {useState} from "react";
import Toggle from "rsuite/Toggle";

interface PropTypes {
    initialLookingFor?: string[]
    lookingForCallback: (lookingFor: string[]) => void
}

export const LookingFor = (props: PropTypes) => {
    const lookingForOptions = [
        {plural: "Men", singular: "man"},
        {plural: "Women", singular: "woman"},
        {plural: "Non-binary people", singular: "nonbinary"},
        {plural: "Trans men", singular: "transMan"},
        {plural: "Trans women", singular: "transWoman"},
    ]
    const [lookingFor, setLookingFor] = useState(new Set(props.initialLookingFor || []))

    return (
        <div style={{margin: "20px auto", marginTop: 30, width: "80%"}}>
            <div style={{fontSize: 12}}>
                Select the groups you're interested in
            </div>

            {
                lookingForOptions.map((identity, key) => {
                    return (
                        <div key={key} style={{marginTop: 10}}>
                            <label>
                                <Toggle
                                    defaultChecked={lookingFor.has(identity.singular)}
                                    onChange={() => {
                                        let newSet
                                        // removes lookingFor from the set if it exists, adds it if it doesn't
                                        if (lookingFor.has(identity.singular)) {
                                            newSet = new Set(lookingFor)
                                            newSet.delete(identity.singular)
                                            setLookingFor(newSet)
                                        }
                                        else {
                                            newSet = new Set(lookingFor)
                                            newSet.add(identity.singular)
                                            setLookingFor(newSet)
                                        }
                                        // run the callback
                                        props.lookingForCallback(Array.from(newSet))
                                    }}
                                />

                                <span style={{marginLeft: 5}}>
                                    {identity.plural}
                                </span>
                            </label>
                        </div>
                    )
                })
            }
        </div>
    )
}
