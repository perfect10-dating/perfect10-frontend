import {Loading} from "@minchat/react-chat-ui";

export function LoadingWrapper() {
    return(
        <div style={{height: "100%", display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <div style={{display: "flex", justifyContent: "left", margin: "0 auto"}}>
                <Loading />
                <div style={{minWidth: 60}} />
            </div>
        </div>
    )
}