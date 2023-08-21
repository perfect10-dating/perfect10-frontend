import 'cropperjs/dist/cropper.css'
import { Component } from 'react'
import Cropper from 'react-cropper'
import { v4 as uuid } from 'uuid'

import styled from 'styled-components/macro'

import { useGetS3SignedUrlMutation } from 'services/api'

const withHooks = (PhotoCropper) => (props) => {
    const [getSignedUrl] = useGetS3SignedUrlMutation()

    return <PhotoCropper {...props} getSignedUrl={getSignedUrl} />
}

class PhotoCropper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            saving: false,
            showUploadLoading: false,
            imageSize: 0,
        }
    }

    dataURItoBlob = (dataURI, type) => {
        type = type || 'image/png'
        let binary = atob(dataURI.split(',')[1])
        let array = []
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i))
        }
        return new Blob([new Uint8Array(array)], { type: type })
    }

    componentDidMount() {
        this._isMounted = true // workaround since React has deprecated isMounted()
    }

    componentWillUnmount() {
        this._isMounted = false // workaround since React has deprecated isMounted()
    }

    handleSave = () => {
        if (this.state.saving) return // don't interrupt current save operation
        let dataUrl = this._cropper.cropper.getCroppedCanvas().toDataURL('image/png')
        let blob = this.dataURItoBlob(dataUrl)
        let file = new File([blob], uuid()) // randomize file name
        this.setState({ saving: true, showUploadLoading: true, imageSize: (file.size / 1000).toFixed(1) })

        this.props
            .getSignedUrl()
            .then(async (value) => {
                if (value?.data?.signedRequest) {
                    await fetch(value.data.signedRequest, {
                        method: 'Put',
                        headers: {
                            'content-type': file.type,
                        },
                        body: file,
                    })
                    this.props.onSave(value.data.resourceUrl)
                }
            })
            .catch(() => {
                alert(
                    'The image could not be cropped. Please check your internet ' +
                    'connection and make sure your clock is set to the correct time.'
                )
            })
            .finally(() => {
                this.setState({ saving: false })
            })
    }

    loadPhoto = (photoUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = (...args) => reject(args)
            img.src = photoUrl
        })
    }

    getImageData = (image) => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context2d = canvas.getContext('2d')
        context2d.drawImage(image, 0, 0)
        return context2d.getImageData(0, 0, image.width, image.height)
    }

    renderUploadLoading = () => {
        return (
            <div>
                <div className="overlay-background"></div>
                <div className="photo-cropper-overlay">
                    <div>
                        <div className="loading-box">
                            {/*<img src="/img/standard_icons/waiting.png" alt="Loading"></img>*/}
                            <p>Uploading photo ({this.state.imageSize} kb)...</p>
                            <p>For optimal performance, please use photo smaller than 512kb</p>
                        </div>
                        <CropSubmit style={{
                            backgroundColor: 'rgb(181, 181, 181)', cursor: 'default',
                            marginTop: 15, padding: 2, paddingLeft: 5, paddingRight: 5,
                            borderRadius: 5, color: "black"
                        }}>
                            Saving...
                        </CropSubmit>
                        <br />
                        <p className="crop-cancel" onClick={this.props.onCancel}>
                            Cancel
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        let aspectRatio = 1
        if (this.props.aspectRatio) {
            aspectRatio = this.props.aspectRatio
        }
        return (
            <div style={{color: "lightgray", textAlign: "center", marginTop: 10}}>
                {this.state.showUploadLoading ? this.renderUploadLoading() :

                    <div>
                        <p>Drag and resize the blue box to crop the photo</p>
                        <p>When you're satisfied with your selection, click 'Save'</p>
                        <Cropper
                            src={this.props.src}
                            style={{ height: 400, width: 400, margin: '20px auto', maxWidth: "80vw", maxHeight: "60vh" }}
                            initialAspectRatio={aspectRatio}
                            aspectRatio={this.props.lockAspectRatio ? aspectRatio : null}
                            guides={false}
                            ref={(cropper) => {
                                this._cropper = cropper
                            }}
                        />
                        <div style={{display: "flex", fontSize: 24, justifyContent: "space-evenly"}}>
                            <CropSubmit onClick={this.handleSave}>
                                Save
                            </CropSubmit>
                            <CropCancel onClick={this.props.onCancel}>Cancel</CropCancel>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default withHooks(PhotoCropper)

const CropSubmit = styled.div`
  display: inline-block;
  color: white;
  cursor: pointer;
`

const CropCancel = styled.div`
  display: inline-block;
  cursor: pointer;
  color: lightgray;
`