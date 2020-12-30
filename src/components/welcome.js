import React, { useState, useEffect } from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import crypto from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const Welcome = (props) => {
    const [param, setParam] = useState();
    const [ws, setWs] = useState();
    const [userParams, setUserParams] = useState();
    const [app, setApp] = useState({});
    const [sendData, setSendData] = useState({});
    const [saved, setSaved] = useState(false);
    const [currentUser, setCurrentUser] = useState();

    const fullSend = () => {

        currentUser.apps[app.appID].name = sendData.name;
        currentUser.apps[app.appID].email = sendData.email;

        console.log(currentUser);

        localStorage.setItem("user", 
            JSON.stringify(currentUser)
        )
        ws.send(JSON.stringify({
            message: "send",
            to: param,
            data: crypto.AES.encrypt(JSON.stringify({ name: sendData.name, email: sendData.email }), param).toString(),
            action: "message"
        }));

        props.history.push("/home");
    }   

    const getUser = (appName, appID) => {
        let user = localStorage.getItem("user");
        if (user) {
            let parsedUser = JSON.parse(user);
            console.log(parsedUser)
            if (!parsedUser.apps[appID]) {
                console.log("HAVEN'T SEEN THIS APP BEFORE");
                parsedUser.apps[appID]  = { appName };
            } else {
                setSaved(true);
            }

            setCurrentUser(parsedUser);
            setSendData({ ...parsedUser.apps[appID]});

            localStorage.setItem("user", 
                JSON.stringify(parsedUser)
            );

        } else {
            const id = uuidv4();
            console.log("NEW USER")
            localStorage.setItem("user", 
                JSON.stringify({ id, apps: {} })
            );
            currentUser({ id , apps: {}})
        }
        
    }

    useEffect(() => {
        localStorage.setItem("app", "client");

        setParam(props.match.params.id);

        const uP = new URLSearchParams(window.location.search);
        setUserParams(uP)

        const appName = uP.get("appName");
        const appID = uP.get("appID");

        setApp({ appName, appID });

        getUser(appName, appID);

        const ws = new W3CWebSocket(`wss://u9j9kermu5.execute-api.us-east-1.amazonaws.com/dev`);
        setWs(ws);
        ws.onopen = () =>  {
            // console.log("connected.");
            ws.send(JSON.stringify({
                message: "connect",
                action: "message"
            }));
        };

        ws.onclose = () => {
            // console.log("disconnected.");
        };

        ws.onmessage = (msg) =>  {
            if (msg.type === "message") {
                const data = JSON.parse(msg.data);
                if (data.status === "connect") {
                    // console.log(data.id);
                    // setId(data.id);
                }
                if (data.status === "send") {
                    // console.log("SEND: ", data);
                }
            }
        };

        // return () => {
        //     ws.close();
        // }
        
    }, [props.match.params.id]);

    return (
        <>
            {userParams && userParams.has("name") && !saved ? 
                <>
                    <h2 style={{margin:"0"}}>what's your name?</h2>
                    <input 
                        value={sendData.name ? sendData.name : "" }
                        placeholder="tap here"
                        type="text" 
                        style={{ 
                            border:"none", 
                            backgroundColor:"transparent", 
                            color:"white", 
                            padding:"10px",
                            fontSize:"16px",
                            marginRight:"15px",
                            outline:"none",
                            marginBottom:"15px"
                        }}
                        onChange={(e) => setSendData({...sendData, name: e.target.value})}
                    /> 
                </> : ""}

            {userParams && userParams.has("email") && !saved ? 
                <> 
                    <h2 style={{margin:"0"}}>what's your email?</h2>
                    <input 
                        value={sendData.email ? sendData.email : "" }
                        placeholder="tap here...email"
                        type="text" 
                        style={{ 
                            border:"none", 
                            backgroundColor:"transparent", 
                            color:"white", 
                            padding:"10px",
                            fontSize:"16px",
                            marginRight:"15px",
                            outline:"none",
                            marginBottom:"15px"
                        }}
                        onChange={(e) => setSendData({...sendData, email: e.target.value})}
                    />
                </>
                : ""}

            { saved ? 
                <>
                    <div style={{padding:"20px"}}>
                        <p>Hi {sendData.name} would you like to sign in to <b>{app.appName}</b> with <u>{sendData.email}</u> ?</p>
                    </div>
                    <div>
                        <button
                        onClick={fullSend} 
                        style={{
                            border:"none",
                            padding:"16px",
                            backgroundColor:"white",
                            borderRadius:"5px",
                            color:"#282c34",
                            width:"200px",
                        }}>Ye</button>
                        {/* <button
                        // onClick={fullSend} 
                        style={{
                            border:"none",
                            padding:"16px",
                            backgroundColor:"white",
                            borderRadius:"5px",
                            color:"#282c34",
                            width:"100px"
                        }}>Nah</button> */}
                    </div>
                </> : 
                <button
                    onClick={fullSend} 
                    style={{
                        border:"none",
                        padding:"16px",
                        backgroundColor:"white",
                        borderRadius:"5px",
                        color:"#282c34",
                        width:"200px"
                    }}>FULL SEND</button>}
            
            

        </>
    )
}

export default Welcome
