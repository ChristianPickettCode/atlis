import React, { useState, useEffect } from 'react'
import QRCode from "qrcode.react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import crypto from "crypto-js";

import { Button, Pane, Dialog } from "evergreen-ui"

const Index = ({request, response}) => {
    

    return (
        user ? 
            ""
            
            : 
            <Pane>
                
                
                <Button onClick={connect}>Connect</Button>
            </Pane>

    )
}

export default Index
