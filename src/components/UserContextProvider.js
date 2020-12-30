import React, { useReducer, useState, useEffect } from 'react';
// import Index from './index';
import { UserContext } from "./UserContext";
import { userReducer } from "./UserReducer";

import QRCode from "qrcode.react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import crypto from "crypto-js";

import { Dialog } from "evergreen-ui"

const UserContextProvider = (props) => {
    const [user, dispatch] = useReducer(userReducer, null);

    const [id, setId] = useState();
    const url = "https://www.esotterik.io"; 
    const [requestString, setRequestString] = useState()

    const [isShown, setIsShown] = useState(false);

    const [u, setU] = useState(false);

    const logout = () => {
        localStorage.removeItem("user");
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
        localStorage.setItem("user", 
            JSON.stringify(d)
        )
        // console.log(d);
        response(d);
    }

    const getUser = () => {
        let user = localStorage.getItem("user");
        if (user) {
            // console.log(user);
            response(JSON.parse(user));
            return true;
        }
        return false;
    }

    const openWS = () => {
        const isUser = getUser();
        //console.log(props.request.appID);
        if (!isUser) {
            setRequestString(props.request.data.join("&"));
            const ws = new W3CWebSocket(`wss://u9j9kermu5.execute-api.us-east-1.amazonaws.com/dev`);
            ws.onopen = () =>  {
                // console.log("connected.");
                ws.send(JSON.stringify({
                    message: "connect",
                    appID: props.request.appID,
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
                        console.log(data)
                        setId(data.id);
                        setIsShown(true);
                        ws.id = data.id;
                    }
                    if (data.status === "send") {
                        parse(data.data, ws);
                    }
                }
            };

            // return () => {
            //     ws.close();
            // }
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
              header={<div style={{margin:"auto"}}><p style={{margin:"0"}}>Connect</p></div>}
              hasFooter={false}
              onCloseComplete={() => setIsShown(false) }
              width={290}
              >
              { id ? 
                  <div style={{width:"256px", margin:"auto"}}>
                      <QRCode size={256}  style={{margin:"auto"}} fgColor="#282c34" value={`${url}/welcome/${id}/?${requestString}&appName=${props.request.appName}&appID=${props.request.appID}`}  onClick={() => console.log(id)}/>
                  </div>
              : ""}
                  
              </Dialog>
        </div>
    )
}

export default UserContextProvider
