import { useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { v4 as uuid } from 'uuid'
// import { ImageScroller } from 'components/ImageHandling/ImageScroller' // todo: revisit

import { useGetS3SignedUrlMutation } from 'services/api'

import PhotoCropper from './PhotoCropper'
import { Popup } from 'components/misc/Popup'

import { IconButtonAction } from 'components/misc/IconButton'

interface Props {
    imageUrl: string
    cropperAspectRatio?: number
    handleChange: (imageUrl: string, attribution?: string) => void
    style?: any
}

export const ImageUploader = ({
                                  imageUrl,
                                  cropperAspectRatio,
                                  handleChange,
                                  style,
                              }: Props) => {
    const [getSignedUrl, result] = useGetS3SignedUrlMutation()
    const [file, setFile] = useState('')
    const id = uuid()
    const [mode, setMode] = useState<'unsplash' | 'flickr'>('unsplash')

    const [attribution, setAttribution] = useState<string>('')
    const [rawImageUrl, setRawImageUrl] = useState<string>('')
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>('')
    const [photoSelectorOpen, setPhotoSelectorOpen] = useState<boolean>(false)
    const [photoCropperOpen, setPhotoCropperOpen] = useState<boolean>(false)

    const fileInput = useRef<HTMLInputElement>(null)

    const handleUploadNavbarImage = (photoUrl: string) => openPhotoCropper(photoUrl)

    const openPhotoCropper = (photoUrl: string) => {
        if (!photoUrl) return
        setRawImageUrl(photoUrl)
        setPhotoCropperOpen(false)
    }

    const handleSaveCrop = (croppedPhotoUrl: string) => {
        setRawImageUrl('')
        setCroppedImageUrl(croppedPhotoUrl)
        setPhotoCropperOpen(false)
        handleChange(croppedPhotoUrl, attribution)
    }

    const handleCancelCrop = () => {
        setRawImageUrl('')
        setCroppedImageUrl('')
        setPhotoCropperOpen(false)
    }

    const handleCancelSelect = () => {
        setPhotoSelectorOpen(false)
    }

    // const handleRemovePhotoUrl = (stateKey) => {
    //   const oldVal = this.state[stateKey]
    //   this.setState({ [stateKey]: '' }, () => {
    //     this.props.editSurvey({_id: this.props.survey._id, delta: { [stateKey]: '' } })
    //     .catch(() => {
    //       alert('Unable to save image. Please check your internet connnection and try reloading the page. Contact us if this issue persists.')
    //       this.setState({[stateKey]: oldVal})
    //     })
    //   })
    // }

    const handleFinishedUploading = (imageUrl: string, attribution?: string) => {
        setRawImageUrl(imageUrl)
        setPhotoCropperOpen(true)
        setAttribution(attribution || '')
    }

    const uploadFromLocal = (event: any) => {
        event.preventDefault()
        fileInput.current?.click()
    }

    return (
        <div style={style}>
            <input
                type="file"
                accept="image/*"
                id={id}
                ref={fileInput}
                style={{ display: 'none' }}
                onChange={(event: any) => {
                    if ((event.target.files?.length || 0) > 0) {
                        const file = event.target.files[0]
                        const type = file.type
                        const reader: any = new FileReader()
                        reader.addEventListener(
                            'load',
                            () => {
                                setRawImageUrl(reader.result)
                                setPhotoCropperOpen(true)
                            },
                            false
                        )
                        reader.readAsDataURL(file)
                        event.target.value = '' // This clears the file selection, allowing the user to upload, remove, and reupload the same image
                    }
                }}
            />
            <div></div>
            <IconButtonAction
                style={{ marginRight: '20px' }}
                handleClick={() => setPhotoSelectorOpen(true)}
                iconUrl={imageUrl === '' ? '/img/standard_icons/upload-image.png' : '/img/standard_icons/change-image.png'}
                alt={'Upload an Image'}
                highlighted={imageUrl !== ''}
                backgroundUrl={imageUrl}
            />
            {photoSelectorOpen && (
                <Popup handleBackgroundClick={handleCancelSelect}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'normal',
                            position: 'fixed',
                            top: 60,
                            right: 0,
                            height: 'calc(100vh - 60px)',
                            width: 300,
                            backgroundColor: '#fff',
                            padding: '0 20px',
                        }}
                    >
                        <img
                            style={{ width: 100, margin: '30px auto', cursor: 'pointer' }}
                            src={'/img/standard_icons/upload-image.png'}
                            onClick={uploadFromLocal}
                            alt="upload new image"
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}
                        >
                            <hr
                                style={{
                                    width: '40%',
                                    marginLeft: 0,
                                    marginRight: 0,
                                    border: '0.5px solid #bec7cf',
                                }}
                            />
                            <p>OR</p>
                            <hr
                                style={{
                                    width: '40%',
                                    marginLeft: 0,
                                    marginRight: 0,
                                    border: '0.5px solid #bec7cf',
                                }}
                            />
                        </div>
                    </div>
                </Popup>
            )}

            {photoCropperOpen && (
                <Popup style={{ left: 280 }} handleBackgroundClick={handleCancelCrop}>
                    <div className="photo-cropper-overlay">
                        <PhotoCropper
                            aspectRatio={cropperAspectRatio}
                            lockAspectRatio={!!cropperAspectRatio}
                            src={rawImageUrl}
                            onSave={handleSaveCrop}
                            onCancel={handleCancelCrop}
                        />
                    </div>
                </Popup>
            )}
        </div>
    )
}