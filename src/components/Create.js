import React, { useState, useEffect } from 'react'
import PlayList from './PlayList'
import SearchResults from './SearchResults'
import Spotify from '../utils/Spotify'
import NavBar from './NavBar'
import * as faceApi from "face-api.js";
import { useNavigate } from 'react-router-dom'
import { savePlaylist } from '../utils/model'
import SpotifyWebApi from 'spotify-web-api-js'

const expressionMap = {
    neutral: "neutral",
    happy: "happy",
    sad: "sad",
    angry: "angry",
    fearful: "fear",
    disgusted: "disgust",
    surprised: "surprised"
    
};

const Create = () => {
    let navigate = useNavigate();
    const spotifyApi = new SpotifyWebApi('6a2a92b3c1694082b94fe135954273fb');
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")))
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
        if (!localStorage.getItem('user')) {
            // navigate('/')       
        }
        setUserData(JSON.parse(localStorage.getItem("user")))
    }, [navigate])
    const [searchResults, setSearchResults] = useState([])
    const [playListName, setPlayListName] = useState("")
    const [playListTracks, setPlayListTracks] = useState([])

    const search = (term) => {
        if (term !== "") {
            Spotify.search(term).then((searchResults) => setSearchResults(searchResults))
        }
        else {
            document.querySelector("#searchBar").focus()
        }
    }
    const addTrack = (track) => {
        if (playListTracks.find((savedTrack) => savedTrack.id === track.id)) {
        return
        }
        const newPlayListTracks = [...playListTracks, track]
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
        }
        else {
        document.querySelector('#playListName').focus()
        }
    }
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
        <>
            <NavBar userData={userData}/>
            <div className="container">
                <article className="section">
                    <div className='heading'>
                        <h1>MOOD</h1>
                        <br/>
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
                <div >
                <video class='video'
                    ref={video}
                    autoPlay
                    muted
                    onPlay={onPlay}
                />
                <br />
                <button className="btn" onClick={() => run()} >Click Here to Play Again</button>
                </div>
                    {/* <SearchResults search={search} searchResults={searchResults} onAdd={doThese} /> */}
                    <PlayList playListTracks={playListTracks} playListName={playListName} onNameChange={updatePlayListname} onRemove={removeTrack} onSave={savePlayList} />
                </article>
            </div>
        </>
    )
}
export default Create