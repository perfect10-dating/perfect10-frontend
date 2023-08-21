import {useState} from "react";
import {ImageUploader} from "./ImageHandling/ImageUploader";

const MAX_NUMBER_USER_IMAGES = 6

interface PropTypes {
    photoLinks: string[]
    photoLinksCallback: (photoLinks: string[]) => void
}

export function ImageUploadPanel(props: PropTypes) {
    let additionalCells = []
    for (let i = 0; i < MAX_NUMBER_USER_IMAGES - props.photoLinks.length; i++) {
        additionalCells.push('')
    }
    let [photoLinks, setPhotoLinks] = useState(props.photoLinks.concat(additionalCells))

    return (
        <div style={{marginTop: 5, backgroundColor: "rgb(243,244,246)", borderRadius: 10}}>
            <div style={{textAlign: "center", paddingTop: 10}}>At least four profile images are required</div>
            <div style={{margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                {
                    photoLinks.map((imageUrl, key) => {
                        return (
                            <div key={key}>
                                <ImageUploader imageUrl={imageUrl}
                                               cropperAspectRatio={3/4}
                                               handleChange={(imageUrl) => {
                                    // when we get a new URL, use that URL
                                    let imageUrlArray = Array.from(photoLinks)
                                    imageUrlArray[key] = imageUrl
                                    setPhotoLinks(imageUrlArray)
                                    props.photoLinksCallback(imageUrlArray)
                                }} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
