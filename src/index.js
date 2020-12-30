import React from 'react';
import UserContextProvider from  "./components/UserContextProvider";

const Bridge = (props) => {
    return (
        <UserContextProvider {...props} />
    )
}

export default Bridge;
