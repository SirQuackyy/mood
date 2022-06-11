import '../App.css';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import * as faceApi from "face-api.js";
import { useHistory } from 'react-router-dom';
import Spotify from '../utils/Spotify';
import { createUser, getUser } from '../utils/model';
import { history } from '../App.js';
import { createBrowserHistory } from 'history';

const expressionMap = {
    neutral: "neutral",
    happy: "happy",
    sad: "sad",
    angry: "angry",
    fearful: "fear",
    disgusted: "disgust",
    surprised: "surprised"
    
};

const Index = () => {   
    // const history = useHistory();
    // const history = createBrowserHistory();
    // if(localStorage.getItem('user')){
        // history.push('/create');
    // }

    const Signup = () => {
        Spotify.getUserId().then((newUserData) => {
            createUser(newUserData)
            .then(req => {
                if(req){
                    // history.push('/create');
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
                    // history.push('/create');
                } else {
                    alert('Spotify account not found! Signup first');
                }
            })
            .catch((err) => console.log(err.message));
        })
    }

    const video = React.createRef();

    const [expressions, setExpressions] = useState([]);

    const log = (...args) => {
        console.log(...args);
    };

    const run = async () => {
        log("run started");
        try {
            await faceApi.nets.tinyFaceDetector.load("/models/");
            await faceApi.loadFaceExpressionModel(`/models/`);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });
            video.current.srcObject = mediaStream;
        } catch (e) {
            log(e.name, e.message, e.stack);
        }
    };
    useEffect(() => {
        run();
    }, [])
    const onPlay = async () => {
        if (
            video.current.paused ||
            video.current.ended ||
            !faceApi.nets.tinyFaceDetector.params
        ) {
            setTimeout(() => onPlay());
            return;
        }

        const options = new faceApi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.5
        });

        const result = await faceApi
            .detectSingleFace(video.current, options)
            .withFaceExpressions();

        if (result) {
            log(result);
            var expressions = [];
            for(const expression in result.expressions){
                expressions.push([expressionMap[expression], result.expressions[expression]]);
            }
            log(expressions);
            setExpressions(expressions);
        }

        setTimeout(() => onPlay(), 1000);
    };

    return (
        <div class="App">
        <div class="my-component"/>
        <title>#Mood</title>
        <div class='heading'>
        <h1>#Mood</h1>
        </div>
        <div>
            {expressions
            .sort((a, b) => b[1] - a[1])
            .filter((_, i) => i < 3)
            .map(([e, w]) => (
                <p key={e + w}>
                {e} {w}
                </p>
            ))}
        </div>
        <div>
        <video
        ref={video}
        autoPlay
        muted
        onPlay={onPlay}
        />
        <br />
        <button class="btn" onClick={() => run()} >Click Here to Play Again</button>
        </div>
        <div class="container">
            <br /><br /><br />
            <h1>Create Your Mood Playlist</h1>
            <br /><br />
            <span class="btn" onClick={() => Login()}>Login</span>
            <br /><br />
            <p>OR</p>
            <span class="btn" onClick={() => Signup()}>SignUp</span>
        </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Index />, rootElement);

export default Index;