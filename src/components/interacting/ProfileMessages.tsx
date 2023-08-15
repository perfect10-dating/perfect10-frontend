import { MessageContainer } from "@minchat/react-chat-ui";
import {useGetMessagesQuery, usePostMessageMutation} from "../../services/api";
import {userSlice} from "../../services/userSlice";
import {store} from "../../app/store";
// https://github.com/MinChatHQ/react-chat-ui

interface PropTypes {
    otherUser: UserMini,
}

export function ProfileMessages(props: PropTypes) {
    const {"user": ownUserState} = store.getState()
    let ownUser = ownUserState.user
    let {data: messages, refetch: refetchMessages} = useGetMessagesQuery({
        otherUserId: props.otherUser._id
    })

    let [postMessage] = usePostMessageMutation()
    let selectedConversation = {}

    if (ownUser) {
        selectedConversation = {
            // TODO -- allow image messages
            messages: (messages || []).filter(message => message.text).map(message => {
                return ({
                    text: message.text,
                    user: {
                        // avatar
                        id: message.sender,
                        name: (message.sender === props.otherUser._id ? props.otherUser.firstName : ownUser?.firstName)
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

                refetchMessages()
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