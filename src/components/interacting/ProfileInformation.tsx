import {useState} from "react";

interface PropTypes {
    information: UserMini
    isPreview?: boolean
}

export function ProfileInformation(props: PropTypes) {
    const [photoLinkIndex, setPhotoLinkIndex] = useState(0)

    return (
        <div style={{height: "100%", width: "100%"}}>
            <div style={{position: "absolute", height: 30, width: "100%"}}>
                <div style={{margin: 10, display: "flex", justifyContent: "space-evenly"}}>
                    {
                        props.information.photoLinks.map((link, key) => {
                            return (
                                <div
                                    key={key}
                                    style={{
                                    backgroundColor: key === photoLinkIndex ? "white" : "grey",
                                    width: `${(100 / props.information.photoLinks.length) - 2}%`,
                                    height: 5,
                                    borderRadius: 2.5,
                                }} />
                            )
                        })
                    }
                </div>
            </div>

            <div style={{position: "absolute", height: 50, width: "100%", bottom: 0, left: 15,
                color: "white", display: "flex"
            }}>
                <div style={{fontSize: 24, fontWeight: "semibold"}}>{props.information.firstName}</div>
                <div style={{fontSize: 20, marginLeft: 10, marginTop: 4}}>{props.information.age}</div>
            </div>

            {
                photoLinkIndex !== 0 &&
                <div style={{position: "absolute", height: "75%", width: "30%",
                    color: "white", top: "10%", left: 0, fontSize: 60, cursor: "pointer",
                    display: "flex", flexDirection: "column", justifyContent: "center"
                }}
                onClick={() => setPhotoLinkIndex(photoLinkIndex-1)}
                >
                    <div style={{marginLeft: 15}}>
                        &#8249;
                    </div>
                </div>
            }

            {
                photoLinkIndex !== props.information.photoLinks.length-1 &&
                <div style={{position: "absolute", height: "75%", width: "30%",
                    color: "white", top: "10%", right: 0, fontSize: 60, cursor: "pointer",
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    textAlign: "right"
                }}
                     onClick={() => setPhotoLinkIndex(photoLinkIndex+1)}
                >
                    <div style={{marginRight: 15}}>
                        &#8250;
                    </div>
                </div>
            }

            <img style={{height: "100%", width: "100%", borderRadius: 15}}
                 src={props.information.photoLinks[photoLinkIndex] || ''}
            />
        </div>
    )
}