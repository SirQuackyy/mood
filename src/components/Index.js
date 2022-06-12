import '../App.css';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, Router } from 'react-router-dom';
import Spotify from '../utils/Spotify';
import { createUser, getUser } from '../utils/model';
import NavBar from './NavBar'

const Index = () => {
    let navigate = useNavigate();
    if(localStorage.getItem('user')){
        navigate('/create');
    }

    const Signup = () => {
        Spotify.getUserId().then((newUserData) => {
            createUser(newUserData)
            .then(req => {
                if(req){
                    navigate('/create');
                } else {
                    alert("Spotify account already registered!")
                }
            })
            .catch((err) => console.log(err.message));
        })
    }

    const Login = () => {
        Spotify.getUserId().then((newUserData) => {
            getUser(newUserData.user_id)
            .then(req => {
                if(req){
                    navigate('/create');
                    // console.log(newUserData);
                } else {
                    alert('Spotify account not found! Signup first');
                }
            })
            .catch((err) => console.log(err.message));
        })
    }

    return (
        <>
        {/* <NavBar userData={userData}/> */}
        <div className="App">
        <div className="my-component"/>
        <title>#Mood</title>
        <div className="container">
            <br /><br /><br />
            <h1>Create Your Mood Playlist</h1>
            <br /><br />
            <span className="btn" onClick={() => Login()}>Login</span>
            <br /><br />
            <p>OR</p>
            <span className="btn" onClick={() => Signup()}>SignUp</span>
        </div>
        </div>
        </>
    );
}

export default Index;