import React, { useState, useEffect } from 'react'
import bgImg from '../assets/pfp.png'
const Track = ({ track, onAdd, onRemove, isRemoval }) => {
    const [trackBg, setTrackBg] = useState('')
    useEffect(() => {
        track.image? setTrackBg(track.image) : setTrackBg(bgImg)
    }, [track.image])
    const addTrack = () => onAdd(track)
    const removeTrack = () => onRemove(track)
    return (
        <ul className="track">
            <li>
                <div>
                    <div className="item" >                        
                        <div>
                            <h3>{track.name}</h3>
                            {track.artist} | {track.album}
                        </div>
                        {
                            onAdd || onRemove ?
                                <TrackAction isRemoval={isRemoval} removeTrack={removeTrack} addTrack={addTrack} />
                            :
                                ""
                        }
                    </div>
                </div>
            </li>
            <li>
                <iframe src={"https://open.spotify.com/embed/track/" + track.id} width="100%" height="80" frameBorder="0" allowtransparency="True" allow="encrypted-media" title="preview" />
            </li>
        </ul>
    )
}
const TrackAction = ({ isRemoval, removeTrack, addTrack }) => {
    return (
        <>
            {
                isRemoval ?
                    <button className="btn" onClick={removeTrack}> - </button>
                :
                    <button className="btn" onClick={addTrack}> + </button>
            }
        </>
    )
}

export default Track