import './NavBar.css';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import userImg from '../assets/pfp.png'

const NavBar = ({ userData }) => {
    const [userProfile, setUserProfile] = useState(false)
    return(
        <>
            <div>
                {/* <div className="dropDown" onMouseEnter={() => setUserProfile(!userProfile)} onMouseLeave={() => setUserProfile(false)}>
                    <img src={userData?.image || userImg} alt="user"/>
                    {userProfile && <ul>
                        <li><h3>{ userData?.name || 'John Doe' }</h3></li>
                        <li>
                            <p>
                                <a href={userData?.url || '/'} target="_blank" rel="noopener noreferrer">{`Profile >>`}</a>
                            </p>
                        </li>
                    </ul>}
                </div> */}
                {/* <div className="container"> */}
            </div>
                <div>
                <nav>
                    <ul> 
                        <li>
                        <Link to="/"> Home</Link>
                        </li>
                        <li>
                        <Link to="/mycollections">Collections</Link>
                        </li>
                        <li>
                        <Link to="/" onClick={() => localStorage.clear()}>Logout</Link>
                        </li>
                        <li>
                        {/* <container className = "contain">
                        <div className="dropDown" onMouseEnter={() => setUserProfile(!userProfile)} onMouseLeave={() => setUserProfile(false)}>
                    <img src={userData?.image || userImg} alt="user"/>
                    {userProfile && <ul>
                        <li><h3>{ userData?.name || 'John Doe' }</h3></li>
                        <li>
                            <p>
                                <a href={userData?.url || '/'} target="_blank" rel="noopener noreferrer">{`Profile >>`}</a>
                            </p>
                        </li>
                    </ul>}
                    </div>
                    </container> */}
                        </li>
                    </ul>
                </nav>
                    {/* <Link to="/" className="btnNav">Home</Link>
                    <Link to="/mycollections" className="btnNav">Collections</Link>
                    <Link to="/" className="btnNav" onClick={() => localStorage.clear()}>Logout</Link> */}
                </div>
            {/* </div> */}
           
  
        </>
    )
}

export default NavBar
