import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        
        const user = localStorage.getItem("user");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, [])

    return (
        <div style={{textAlign:"left"}}>
            {console.log(currentUser)}
            { currentUser && currentUser.apps ? 
                Object.entries(currentUser.apps).map(([key, value]) => (
                <li key={key} style={{marginBottom:"15px"}}> 
                    <Link to={`/home/${key}`}>{value.appName}</Link>
                </li>
                ))
             : ""}
        </div>
    )
}

export default Home
