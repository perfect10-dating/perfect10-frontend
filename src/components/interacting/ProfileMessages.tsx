import { MessageContainer } from "@minchat/react-chat-ui";
import {useGetMessagesQuery, usePostMessageMutation} from "../../services/api";
import {userSlice} from "../../services/userSlice";
import {store} from "../../app/store";
import {useEffect} from "react";
// https://github.com/MinChatHQ/react-chat-ui
const REFRESH_NUM_SECS = 10

interface PropTypes {
    otherUser: UserMini,
}

export function ProfileMessages(props: PropTypes) {
    const {"user": ownUserState} = store.getState()
    let ownUser = ownUserState.user
    let {data: messages, refetch: refetchMessages} = useGetMessagesQuery({
        otherUserId: props.otherUser._id
    })

    // starts a polling loop
    useEffect(() => {
        const loop = async () => {
            while (true) {
                await new Promise(resolve => setTimeout(resolve, REFRESH_NUM_SECS*1000))
                refetchMessages()
            }
        }

        loop()

    }, [])

    let [postMessage] = usePostMessageMutation()
    let selectedConversation = {}

    if (ownUser) {
        selectedConversation = {
            // TODO -- allow image messages
            messages: (messages || []).filter(message => message.text).map(message => {
                let info = {firstName: ownUser?.firstName, avatar: ownUser?.photoLinks[0]}
                if (message.sender === props.otherUser._id) {
                    info = {firstName: props.otherUser.firstName, avatar: props.otherUser.photoLinks[0]}
                }

                return ({
                    text: message.text,
                    user: {
                        avatar: info.avatar,
                        id: message.sender,
                        name: info.firstName
                    }
                })
            }),
            currentUserId: ownUser?._id,
            onSendMessage: (message: string) => {
                postMessage({
                    conversationId: ((messages || [])[0]?.conversation || ""),
                    otherUserId: props.otherUser._id,
                    text: message,
                    isImage: false
                })

                // refetchMessages()
            }

            // TODO -- set up attachment features
        }
    }

    return (
        <div style={{width: "100%", height: "100%", zIndex: 0, position: "relative"}}>
            <div style={{position: "absolute", zIndex: 1000, display: "flex", justifyContent: "space-evenly",
                width: "100%", marginTop: 18, backgroundColor: "rgb(243,244,246)", paddingBottom: 18,}}
                />
            <MessageContainer {...selectedConversation} mobileView={true} />
        </div>
    )
}