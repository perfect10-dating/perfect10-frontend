import {useNavigate} from "react-router-dom";
import {asyncSignOut} from "../../services/authSlice";
import {useAppDispatch} from "../../app/hooks";

interface PropTypes {
    user: User
}

export function TopBar(props: PropTypes) {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // TODO -- images for each of these
    return (
        <div style={{position: "absolute", zIndex: 10000, top: 0, backgroundColor: "rgb(200, 200, 200)",
            display: "flex", justifyContent: "space-between", flexWrap: "wrap",
            fontSize: 24, padding: 5, width: "100vw"
        }}>
            <div style={{display: "flex"}}>
                <div style={{cursor: "pointer", marginLeft: 20, marginRight: 30, fontWeight: 500
                }} onClick={() => navigate("/")}>
                    Date
                </div>
                <div style={{cursor: "pointer", fontWeight: 500, marginRight: 30}} onClick={() => navigate("/account")}>
                    Account
                </div>
                <div style={{cursor: "pointer", fontWeight: 500}} onClick={() => navigate("/priority")}>
                    Priority Mode
                </div>
            </div>

            <div style={{marginRight: 20}}>
                <div
                    style={{fontSize: 20, cursor: "pointer"}}
                    onClick={async () => {
                        await dispatch(asyncSignOut())
                        dispatch({
                            // format -- reducerPath/invalidateTags
                            // see: https://github.com/reduxjs/redux-toolkit/issues/1862
                            type: `api/invalidateTags`,
                            payload: ['USER'],
                        });
                    }}
                >
                    Log Out
                </div>
            </div>
        </div>
    )
}