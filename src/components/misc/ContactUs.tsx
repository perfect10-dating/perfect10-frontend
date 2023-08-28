import appConfiguration from "../../appConfiguration";

export function ContactUs() {
    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100vh"}}>
            <div style={{maxWidth: "calc(100vw - 20)", maxHeight: "calc(100vh - 20)", textAlign: "center", margin: 10}}>
                <p style={{fontSize: 30}}>Questions or Issues?</p>
                <p style={{marginTop: 10}}>Please contact us at the following email address</p>
                <a href={`mailto:${appConfiguration.supportEmail}`} style={{}}>{appConfiguration.supportEmail}</a>
            </div>
        </div>
    )
}