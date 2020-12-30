import React, { useEffect, useState } from 'react';

const HomeDetail = (props) => {
    const [param, setParam] = useState();
    const [app, setApp] = useState();

    useEffect(() => {
        const id = props.match.params.id;
        setParam(id);
        const user = localStorage.getItem("user");
        if (user) {
            const parseUser = JSON.parse(user);
            setApp(parseUser.apps[id]);
        }
    }, [props.match.params.id])

    return (
        <div>
            {app && ( 
                <div style={{textAlign:"left"}}>
                    <p>{app.name}</p>
                    <p>{app.email}</p>
                    <p>{app.appName}</p>
                    <p>{param}</p>
                    <br />
                    <p style={{color:"red", cursor:"pointer"}} onClick={() => {
                        if(window.confirm("Would you like to delete this id?")) {
                            const data = localStorage.getItem("user");
                            let user = JSON.parse(data);
                            console.log(user);
                            if (user) {
                                delete user.apps[param];
                                localStorage.setItem("user", JSON.stringify(user));
                                props.history.push("/home");
                            }
                            
                        }
                    }}>delete</p>
            </div> )}
        </div>
    )
}

export default HomeDetail
