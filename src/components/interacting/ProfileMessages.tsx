import { MessageContainer } from "@minchat/react-chat-ui";
// https://github.com/MinChatHQ/react-chat-ui

interface PropTypes {
    ownId: string,
    otherUser: UserMini,
}

export function ProfileMessages(props: PropTypes) {
    const selectedConversation = {
        title: "Baron",
        messages: [
            {
                text: "this is the prev message in the conversation",
                user: {
                    // avatar
                    id: props.otherUser._id,
                    name: props.otherUser.firstName
                }
            },
            {
                seen: false,
                text: "this is the last message in the conversation",
                user: {
                    // avatar
                    id: props.ownId,
                    name: props.otherUser.firstName
                }
            }
        ],
        currentUserId: props.ownId,
        onSendMessage: (message: string) => console.log(message)
        // TODO -- set up attachment features
    }

    return (
        <div>
            <MessageContainer {...selectedConversation} mobileView={true} />
        </div>
    )
}