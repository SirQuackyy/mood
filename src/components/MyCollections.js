import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
// import { useHistory } from "react-router-dom";
import { deletePlaylist, getPlaylists } from "../utils/model";
import bgImg from '../assets/pfp.png'
import Track from './Track'
const MyCollections = () => {
    // const history = useHistory();
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")));
    const [playlists, setPlaylists] = useState([])
    const [activePlaylist, setactivePlaylist] = useState()
    useEffect(() => {
    if (!localStorage.getItem("user")) {
        // history.push("/");
    }
    getPlaylists(userData?.user_id)
    .then(req => {
        return setPlaylists(req)
    })
    .catch((err) => console.log(err.message))
    if (!userData) {
        setUserData(JSON.parse(localStorage.getItem("user")))
    }
    }, [userData]);
    // }, [userData, history]);

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
        <NavBar userData={userData} />
        <div className="container">
        <h1 >
            My Collections
        </h1>
        <article className="section">            
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
                        <h2 >No Playlist saved . . .</h2>
                    }
                </div>
            </div>
        </article>
        </div>
    </>
    );
};
export default MyCollections;