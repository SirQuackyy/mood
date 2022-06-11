import React from 'react'
import { Link } from 'react-router-dom' 
const Error = () => {
    return (
        <div >
            <h1> Oops! Page Not found. </h1>
            <h3><Link to="/create">Go back to safety</Link></h3>
        </div>
    )
}
export default Error