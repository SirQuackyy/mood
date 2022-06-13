import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { deletePlaylist, getPlaylists } from "../utils/model";
import bgImg from '../assets/pfp.png'
import Track from './Track'
import Spotify from "../utils/Spotify";
const MyCollections = () => {
   
    const navigate = useNavigate();
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")));
    const [playlists, setPlaylists] = useState([])
    const [activePlaylist, setactivePlaylist] = useState()
    useEffect(() => {
    if (!localStorage.getItem("user")) {
        // navigate("/");
    }
    getPlaylists(userData?.user_id)
    .then(req => {
        return setPlaylists(req)
    })
    .catch((err) => console.log(err.message))
    if (!userData) {
        setUserData(JSON.parse(localStorage.getItem("user")))
    }
    }, [userData, navigate]);

    const togglePlaylist = (id) => {
        if (activePlaylist === id) {
            setactivePlaylist()
        }
        else {
            setactivePlaylist(id)
        }
    }
    const removePlaylist = (playlist) => {
        deletePlaylist(playlist.id)
        .then(req => {
            const newPlaylist = playlists.filter((list) => list.id !== playlist.id)
            playlists.unshift(playlist)
            return setPlaylists(newPlaylist)
        })
        .catch((err) => console.log(err.message))
    } 
    return (
    <>
        <div className="collectionz">
        <NavBar userData={userData} />
        <div className="container">
        <h1 >
            My Collection
        </h1>     
            <div className="trackList">
                <div className="playList">
                    {playlists.length ?
                        playlists?.map((playlist) => { return (
                            <ul className="track" key={playlist.id}>
                                <li onClick={() => togglePlaylist(playlist.id)}>
                                    <div >
                                        <div className="item" >                        
                                            <div>
                                                <h3>{playlist.name}</h3>
                                            </div>
                                            <button className="btn" onClick={(e) => {
                                                e.preventDefault()
                                                removePlaylist(playlist)
                                            }}> Delete </button>
                                            <button className="btn" onClick={(e) => {
                                                e.preventDefault()
                                                Spotify.makePlaylist(playlist.tracks, playlist.name);
                                            }}> Download To Spotify </button>
                                        </div>
                                    </div>
                                </li>
                                {activePlaylist === playlist.id &&
                                    <div >
                                        {playlist.tracks.map((track) => {
                                            return (
                                                <Track
                                                    key={track.id}
                                                    track={track}
                                                />
                                        )})}
                                    </div>
                                }
                            </ul>
                        )
                        })
                    :
                        <h3 > No Playlists Are Saved </h3>
                    }
                </div>
            </div>
        </div>
        </div>
    </>
    );
};
export default MyCollections;