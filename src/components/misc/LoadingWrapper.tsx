import {Loading} from "@minchat/react-chat-ui";

export function LoadingWrapper() {
    return(
        <div style={{margin: "0 auto", height: "100%", display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <Loading />
        </div>
    )
}