import {useNavigate} from "react-router-dom";

interface PropTypes {
    user: User
}

export function TopBar(props: PropTypes) {
    const navigate = useNavigate()

    // TODO -- images for each of these
    return (
        <div style={{position: "absolute", zIndex: 10000, top: 0, backgroundColor: "rgb(200, 200, 200)",
            display: "flex", fontSize: 24, padding: 5, width: "100vw"
        }}>
            <div style={{cursor: "pointer", marginLeft: 20, marginRight: 20, fontWeight: 500}} onClick={() => navigate("/")}>
                Date
            </div>
            <div style={{cursor: "pointer", fontWeight: 500}} onClick={() => navigate("/account")}>
                Account
            </div>
        </div>
    )
}