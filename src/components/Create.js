import React, {
    useState,
    useEffect
} from 'react'
import PlayList from './PlayList'
import SearchResults from './SearchResults'
import Spotify from '../utils/Spotify'
import NavBar from './NavBar'
import * as faceApi from "face-api.js";
import {
    useNavigate
} from 'react-router-dom'
import {
    savePlaylist
} from '../utils/model'

const expressionMap = {
    neutral: "neutral",
    happy: "happy",
    sad: "sad",
    angry: "angry",
    fearful: "fear",
    disgusted: "disgust",
    surprised: "surprised"

};
class C{
    
}
const Create = () => {
    constructor(){
        const x = addTracks(x);
    };
    let navigate = useNavigate();
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")))
    const video = React.createRef();

    const [expressions, setExpressions] = useState([]);

    const log = (...args) => {
        console.log(...args);
    };

    const [possibleSongs, setPossibleSongs] = useState([])

    const run = async () => {
        log("run started");
        try {
            await faceApi.nets.tinyFaceDetector.load("/models/");
            await faceApi.loadFaceExpressionModel(`/models/`);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                }
            });
            console.log(mediaStream);
            video.current.srcObject = mediaStream;
        } catch (e) {
            log(e.name, e.message, e.stack);
        }
    };
    useEffect(() => {
        run();
        if (!localStorage.getItem('user')) {
            // navigate('/')       
        }
        setUserData(JSON.parse(localStorage.getItem("user")))
    }, [navigate])
    const [searchResults, setSearchResults] = useState([])
    const [playListName, setPlayListName] = useState("")
    const [playListTracks, setPlayListTracks] = useState([])
    const [songs, setSongs] = useState([])

    const search = (term) => {
        if (term !== "") {
            Spotify.search(term).then((searchResults) => setSearchResults(searchResults))
        } else {
            document.querySelector("#searchBar").focus()
        }
    }
    const addTrack = (track) => {
        if (playListTracks.find((savedTrack) => savedTrack.id === track.id)) {
            return
        }
        const newPlayListTracks = playListTracks;
        newPlayListTracks.push(track);
        setPlayListTracks(newPlayListTracks)
    }
    const removeTrack = (track) => {
        const newPlayListTracks = playListTracks.filter((currentTrack) => currentTrack.id !== track.id)
        searchResults.unshift(track)
        setPlayListTracks(newPlayListTracks)
    }
    const removeTrackSearch = (track) => {
        const newSearchResults = searchResults.filter((currentTrack) => currentTrack.id !== track.id)
        setSearchResults(newSearchResults)
    }
    const doThese = (track) => {
        addTrack(track)
        removeTrackSearch(track)
    }
    const updatePlayListname = (name) => {
        setPlayListName(name)
    }
    const savePlayList = (e) => {
        e.preventDefault()
        if (playListName !== "") {
            alert('Playlist added successfully...')
            savePlaylist(userData.user_id, playListName, playListTracks)
                .then(req => {
                    if (req) {
                        setPlayListName("")
                        setPlayListTracks([])
                    }
                })
        } else {
            document.querySelector('#playListName').focus()
        }
    }
    const onPlay = async () => {
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
            var expressionNum = 0;
            for (const expression in result.expressions) {
                expressions.push([expressionMap[expression], result.expressions[expression]]);
            }
            log(expressions);
            setExpressions(expressions);
            createPlaylist(expressions);
            const sorted = expressions.sort((a, b) => b[1] - a[1]);
            if(sorted[0][0] === "neutral"){
                expressionNum = 1;
            }else if(sorted[0][0] === "angry"){
                expressionNum = 2;
            }else if(sorted[0][0] === "sad"){
                expressionNum = 3;
            }else if(sorted[0][0] === "surprised"){
                expressionNum = 4;
            }else if(sorted[0][0] === "happy"){
                expressionNum = 5;
            }else {
                expressionNum=0;
            }
            andew(expressionNum);
        }

        setTimeout(() => onPlay(), 1000);
    };
    var highestMood = "";
    var highestPercentage = null;
    const delay = time => new Promise(res => setTimeout(res, time));

    const createPlaylist = async (expressions) => {

        const sorted = expressions.sort((a, b) => b[1] - a[1]);
        for (let i = 0; i < sorted.length; i++) {
            if (sorted[i][0] === "disgust" || sorted[i][0] === "fear") {
                continue;
            } else {
                highestMood = sorted[i][0];
                highestPercentage = sorted[i][1] * 100;
                break;
            }
        }

        Spotify.getUserSongs(highestMood, highestPercentage);
    }
    const andew = (f) => {
    
        switch(f){
            case 0:
                <div className= "pink.bg">"";</div>
                break;
            case 1:
                <div className = "white.bg">"";</div>
                break;
            case 2:
                <div className = "red.bg">"";</div>
                break;
            case 3:
                <div className = "blue.bg">"";</div>
                break;
            case 4:
                <div className = "orange.bg">"";</div>
                break;
            case 5:
                <div className = "yellow.bg">"";</div> 
                break;   
        }
}

    return ( 
        // call smth to change value of F
        
        <body className={andew()}>

        {/* <div className={(f == 0) ? "white.bg" }/>//neutral
        <div className={(f == 1) ? "orange.bg" }/> //suprised
        <div className={(f == 2) ? "red.bg" }/> //angry
        <div className={(f == 3) ? "yellow.bg" }/> //happy
        <div className={(f == 4) ? "blue.bg" }/> //sad */}

        
        <>
        <NavBar userData = {
            userData
        }/> 
        <div className = "container">
        <div className = 'mood'>
        <h1 className = "moody"> MOOD </h1> 
        <br/>
        </div> 
        <div className = 'videoDiv'>
        <h3> { highestMood } { highestPercentage } { highestPercentage ? < h3 > % </h3> : <h3></h3 > } </h3> 
        <video className = 'video'
        ref = {
            video
        }
        autoPlay muted onPlay = {
            onPlay
        }/> 
        <br/>
        <br/>
        <button className = "btn"
        onClick = {
            () => run()
        } > Create a Playlist </button> 
        </div> {
            /* <SearchResults search={search} searchResults={searchResults} onAdd={doThese} /> */
        } 
        <PlayList playListTracks = {
            playListTracks
        }
        playListName = {
            playListName
        }
        onNameChange = {
            updatePlayListname
        }
        onRemove = {
            removeTrack
        }
        onSave = {
            savePlayList
        }/> 
       
        </div>
        </>
        </body>
    )
}


export default Create;