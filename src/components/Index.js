import '../App.css';
import React from "react";
import { useNavigate } from 'react-router-dom';
import Spotify from '../utils/Spotify';
import { createUser, getUser } from '../utils/model';
import $ from 'jquery'; 
import { gsap } from 'gsap';

const Index = () => {
    let navigate = useNavigate();
    if(localStorage.getItem('user')){
        navigate('/create');
    }

    // const Signup = () => {
    //     Spotify.getUserId().then((newUserData) => {
    //         createUser(newUserData)
    //         .then(req => {
    //             if(req){
    //                 navigate('/create');
    //             } else {
    //                 alert("Spotify account already registered!")
    //             }
    //         })
    //         .catch((err) => console.log(err.message));
    //     })
    // }
    const BackGround = () =>{
        gsap.set('.main', {position:'fixed', background:'#fff', width:'100%', maxWidth:'1200px', height:'100%', top:0, left:'50%', x:'-50%'})
        gsap.set('.scrollDist', {width:'100%', height:'200%'})
        gsap.timeline({scrollTrigger:{trigger:'.scrollDist', start:'top top', end:'bottom bottom', scrub:1}})
        .fromTo('.sky', {y:0},{y:-200}, 0)
        .fromTo('.cloud1', {y:100},{y:-800}, 0)
        .fromTo('.cloud2', {y:-150},{y:-500}, 0)
        .fromTo('.cloud3', {y:-50},{y:-650}, 0)
        .fromTo('.mountBg', {y:-10},{y:-100}, 0)
        .fromTo('.mountMg', {y:-30},{y:-250}, 0)
        .fromTo('.mountFg', {y:-50},{y:-600}, 0)

        $('#arrowBtn').on('mouseenter', (e)=>{ gsap.to('.arrow', {y:10, duration:0.8, ease:'back.inOut(3)', overwrite:'auto'}); })
        $('#arrowBtn').on('mouseleave', (e)=>{ gsap.to('.arrow', {y:0, duration:0.5, ease:'power3.out', overwrite:'auto'}); })
        // $('#arrowBtn').on('click', (e)=>{ gsap.to(window, {scrollTo:innerHeight, duration:1.5, ease:'power1.inOut'}); }) // scrollTo requires the ScrollTo plugin (not to be confused w/ ScrollTrigger)
            }
    const Login = () => {
        Spotify.getUserId().then((newUserData) => {
            getUser(newUserData.user_id)
            .then(req => {
                if(req){
                    navigate('/create');
                    // console.log(newUserData);
                } else {
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
            })
            .catch((err) => console.log(err.message));
        })
    }

    return (
      
        
        <div className="App">
        <title>Mood</title>
            <body className='bg'>
            <h1 className='playlist'>  <b>Mood</b> </h1>
            <br/>
            <div class ='wrapper'>
            <span class = 'btn-pulse' onClick={() => Login()}>Get Started</span>
            </div>
            {/* <h2> or </h2> */}
            {/*  */}
            {/* <span className="btn" onClick={() => Signup()}>SignUp</span> */}
            {/*  */}
            <br/>
            {/* <span className="btn" onClick={() => AboutUs()}>About Us</span> */}
            </body>
        </div>
        
     );
}

export default Index;