import React from 'react'
import Track from './Track'
import Img from '../assets/omo.png'
const TrackList = ({ tracks, onAdd, isRemoval, onRemove }) => {
    return (
        <>
            {(tracks.length > 0) &&
                <div className="playList">
                    {tracks.map((track) => {
                        return (
                            <Track key={track.id} track={track} onAdd={onAdd} isRemoval={isRemoval} onRemove={onRemove} />
                        )
                    })}
                </div >
            }
            {(tracks.length === 0) &&
                <div className="playList">
                <img src={Img} alt="Oops!" />
                    <h3>Oops! No Tracks founds</h3>
                </div>
            }
        </>
    )
}
export default TrackList