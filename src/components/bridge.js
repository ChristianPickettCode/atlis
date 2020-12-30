import React from 'react';
import UserContextProvider from  "./UserContextProvider"
/**
 * <Bridge request={{
        data: ["email", "name"],
        appName: "apple",
        appID: "123"
    }}>
        <Hi />
    </Bridge>
 */

const Bridge = (props) => {
    return (
        <UserContextProvider {...props} />
    )
}

export default Bridge
