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

let addTrackToPlayList = false;
let tracksLatest = [];
let firstRun = true;

export const addTrackOut = (track) => {
    addTrackToPlayList = true;
    tracksLatest = track;
}

const Create = () => {
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
        if(!firstRun){
            setDisable(true)
        } else {
            firstRun = false;
        }
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
        if(firstRun){
            run();
        }
        if (!localStorage.getItem('user')) {
            // navigate('/')       
        }
        setUserData(JSON.parse(localStorage.getItem("user")))
        if(addTrackToPlayList){
            for(let i = 0; i < tracksLatest.length; i++){
                addTrack(tracksLatest[i]);    
            }
            addTrackToPlayList = false;
            setReloadState(!reloadState);
            setDisable(false);
        }
    }, [navigate, addTrackToPlayList])
    const [searchResults, setSearchResults] = useState([])
    const [playListName, setPlayListName] = useState("")
    const [playListTracks, setPlayListTracks] = useState([])
    const [songs, setSongs] = useState([])
    const [reloadState, setReloadState] = useState(false)
    const [disable, setDisable] = React.useState(false);

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
    
    return ( 

        <div className = "fullpage">

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
        <video className = 'video'
        ref = {
            video
        }
        autoPlay muted onPlay = {
            onPlay
        }/> 
        <br/>
        <br/>
        <button className = "btn" onClick = {() => run()} disabled={disable} > Create a Playlist </button> 
            
        
        
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
        </div>
        
    )
}


export default Create;