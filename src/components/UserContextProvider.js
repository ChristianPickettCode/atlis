import React, { useReducer, useState, useEffect } from 'react';
import { UserContext } from "./UserContext";
import { userReducer } from "./UserReducer";

import QRCode from "qrcode.react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import crypto from "crypto-js";

import { Dialog } from "evergreen-ui";
import jwt from "jsonwebtoken";

const UserContextProvider = (props) => {
    const [user, dispatch] = useReducer(userReducer, null);

    const [id, setId] = useState();
    const url = "https://app.atlis.dev";
    const [requestString, setRequestString] = useState()

    const [isShown, setIsShown] = useState(false);

    const [u, setU] = useState(false);

    const [req, setReq] = useState();

    const logout = () => {
        localStorage.removeItem("atlis_london");
        localStorage.removeItem("app");
        localStorage.removeItem("request");
        window.location.reload();
    }

    const login = () => {
      openWS();
    }

    const childWithUserProp = React.Children.map(
        props.children,
        (child) => {
          return React.cloneElement((child), {
            user,
            logout,
            login,
            ...props
          });
        }
      );

    const response = (data) => {
        dispatch({type: "SET_USER", user: data});
        setIsShown(false);
    }

    const parse = (encryptedData, ws) => {
        const parsedData = crypto.AES.decrypt(encryptedData, ws.id).toString(crypto.enc.Utf8)
        const d = JSON.parse(parsedData);
        localStorage.setItem("atlis_london", 
            jwt.sign(d, props.request.appID)
        )
        response(d);
    }

    const getUser = () => {
        let user = localStorage.getItem("atlis_london");
        if (user) {
            try {
                response(jwt.verify(user, props.request.appID));
                return true;
            } catch(err) {
                console.log(err);
                logout();
                return false;
            }
        }
        return false;
    }

    const openWS = () => {
        const isUser = getUser();
        if (!isUser) {
            setRequestString(props.request.data.join(","));
            const ws = new W3CWebSocket(`wss://u9j9kermu5.execute-api.us-east-1.amazonaws.com/dev`);
            ws.onopen = () =>  {
                ws.send(JSON.stringify({
                    message: "connect",
                    appID: props.request.appID,
                    action: "message"
                }));
            };

            ws.onmessage = (msg) =>  {
                if (msg.type === "message") {
                    const data = JSON.parse(msg.data);
                    if (data.status === "connect") {
                        setId(data.id);
                        setIsShown(true);
                        ws.id = data.id;

                        const d = {
                            request: props.request.data,
                            appName: props.request.appName,
                            appID: props.request.appID
                        }
                        
                        const resData = jwt.sign(d, data.id);

                        const res = `${url}/welcome?requestID=${data.id}&data=${resData}`;
                        console.log(res);
                        setReq(res);

                    }
                    if (data.status === "send") {
                        parse(data.data, ws);
                    }
                }
            };
        }

    }

    useEffect(() => {
        setU(getUser());
    }, [])

    return (
        <div style={{width:"100%", height:"100%"}}>
            <UserContext.Provider value={user, dispatch}>
                {childWithUserProp}
            </UserContext.Provider>
            <Dialog
              isShown={isShown}
              header={<div style={{margin:"0 auto"}}><p style={{margin:"0", fontFamily:"sans-serif", fontSize:"16px"}}>Connect with <a href="https://atlis.dev" target="blank" style={{color:"#1890ff", textDecoration:"none"}}>Atlis</a></p></div>}
              hasFooter={false}
              onCloseComplete={() => setIsShown(false) }
              width={290}
              >
              { id && req ? 
                  <div style={{width:"256px", margin:"auto"}}>
                      <QRCode size={256}  style={{margin:"auto"}} fgColor="#282c34" value={req}  onClick={() => console.log(id)}/>
                  </div>
              : ""}
                  
              </Dialog>
        </div>
    )
}

export default UserContextProvider
