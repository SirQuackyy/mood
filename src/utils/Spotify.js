import Create from "../components/Create"
import { addTrackOut } from "../components/Create"

const clientId = '6a2a92b3c1694082b94fe135954273fb'
const redirectUri = encodeURIComponent("http://localhost:3000/")
const scopes = encodeURIComponent("user-read-private user-read-email playlist-modify-public user-top-read user-read-recently-played user-read-playback-position playlist-modify-public playlist-read-private playlist-modify-private user-library-read")

let accessToken
const delay = time => new Promise(res => setTimeout(res, time));

const Spotify = {
    getAccessToken: () => {
        if (localStorage.getItem('accessToken')) {
            return JSON.parse(localStorage.getItem('accessToken'));
        }
        accessToken = window.location.hash.substring(1)
            .split('&')
            .reduce((initial, item) => {
                let parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
                return initial;
            }, {}).access_token;
        if (accessToken) {
            localStorage.setItem('accessToken', JSON.stringify(accessToken));
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`;
            window.location = accessUrl;
        }
    },
    getUserSongs2: () => {
        accessToken = Spotify.getAccessToken()
        if (accessToken) {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            return fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0", {
                    headers: headers
                })
                .then(response => response.json())
                .then((jsonResponse) => {
                    if (jsonResponse) {
                        const {
                            items
                        } = jsonResponse;
                        let songList3 = [];
                        for (let i = 0; i < items.length; i++) {
                            fetch(`https://api.spotify.com/v1/artists/${items[i].id}/related-artists`, {
                                    headers: headers
                                })
                                .then(response2 => response2.json())
                                .then((jsonResponse2) => {
                                    if (jsonResponse2) {
                                        const {
                                            artists
                                        } = jsonResponse2;
                                        fetch(`https://api.spotify.com/v1/artists/${artists[0].id}/top-tracks?market=US`, {
                                                headers: headers
                                            })
                                            .then(response3 => response3.json())
                                            .then((jsonResponse3) => {
                                                if (jsonResponse3) {
                                                    const {
                                                        tracks
                                                    } = jsonResponse3;
                                                    for (let j = 0; j < tracks.length; j++) {
                                                        songList3.push(tracks[j].id);
                                                    }
                                                }
                                            })
                                    }
                                })
                        }
                        return songList3;
                    }
                })
        }
    },
    getUserSongs: (highestMood, highestPercentage) => {
        accessToken = Spotify.getAccessToken()
        if (accessToken) {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            return fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10&offset=0", {
                    headers: headers
                })
                .then(response => response.json())
                .then(async function (jsonResponse) {
                    return Spotify.getRelatedArtists(jsonResponse, highestMood, highestPercentage);
                })
        }
    },
    getRelatedArtists: (jsonResponse, highestMood, highestPercentage) => {
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        if (jsonResponse) {
            const {
                items
            } = jsonResponse;
            let promises = [];
            for (let i = 0; i < items.length; i++) {
                promises.push(fetch(`https://api.spotify.com/v1/artists/${items[i].id}/related-artists`, {
                    headers: headers
                }))
            }
            Promise.all(promises)
                .then(async ([aa, bb, cc, dd, ee, ff, gg, hh, ii, jj]) => {
                    const a = await aa.json();
                    const b = await bb.json();
                    const c = await cc.json();
                    const d = await dd.json();
                    const e = await ee.json();
                    const f = await ff.json();
                    const g = await gg.json();
                    const h = await hh.json();
                    const i = await ii.json();
                    const j = await jj.json();
                    return Spotify.getArtistTracks(highestMood, highestPercentage, [a.artists[0], b.artists[0], c.artists[0], d.artists[0], e.artists[0], f.artists[0], g.artists[0], h.artists[0], i.artists[0], j.artists[0]]);
                });
        }
    },
    getArtistTracks: (highestMood, highestPercentage, responseText) => {
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        const songList = [];
        let promisesTrack = [];
        for (let j = 0; j < responseText.length; j++) {
            promisesTrack.push(fetch(`https://api.spotify.com/v1/artists/${responseText[j].id}/top-tracks?market=US`, {
                headers: headers
            }))
        }
        Promise.all(promisesTrack)
            .then(async ([aa2, bb2, cc2, dd2, ee2, ff2, gg2, hh2, ii2, jj2]) => {
                const a2 = await aa2.json();
                const b2 = await bb2.json();
                const c2 = await cc2.json();
                const d2 = await dd2.json();
                const e2 = await ee2.json();
                const f2 = await ff2.json();
                const g2 = await gg2.json();
                const h2 = await hh2.json();
                const i2 = await ii2.json();
                const j2 = await jj2.json();
                return [a2.tracks, b2.tracks, c2.tracks, d2.tracks, e2.tracks, f2.tracks, g2.tracks, h2.tracks, i2.tracks, j2.tracks];
            })
            .then((responseText2) => {
                for (let k = 0; k < responseText2.length; k++) {
                    for (let l = 0; l < responseText2[k].length; l++) {
                        songList.push(responseText2[k][l].id);
                    }
                }
                return Spotify.getMoodSongs(songList, highestMood, highestPercentage);
            });
    },
    getMoodSongs: async (possibleSongs, mood, percentage) => {
        accessToken = Spotify.getAccessToken()
        if (accessToken) {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            await delay(5000);
            let promisesMood = [];
            for (let i = 0; i < possibleSongs.length; i++) {
                promisesMood.push(fetch(`https://api.spotify.com/v1/audio-features/${possibleSongs[i]}`, {
                        headers: headers
                    }))
            }
            Promise.all(promisesMood)
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then((jsonResponse) => {
                const finalSongs = [];
                for(let i = 0; i < jsonResponse.length; i++){
                    if (jsonResponse[i]) {
                        const {
                            danceability,
                            energy,
                            tempo,
                            valence
                        } = jsonResponse[i];
                        switch (mood) {
                            case 'happy':
                                if (danceability > 0.5 && (energy > 0.5 || tempo > 100) && valence > 0.6) {
                                    finalSongs.push(possibleSongs[i]);
                                }
                                break;
                            case 'sad':
                                if (danceability < 0.8 && (energy < 0.6 || tempo < 90) && valence < 0.55) {
                                    finalSongs.push(possibleSongs[i]);
                                }
                                break;
                            case 'angry':
                                if (danceability > 0.5 && (energy > 0.7 || tempo > 100) && valence < 0.4) {
                                    finalSongs.push(possibleSongs[i]);
                                }
                                break;
                            case 'surprised':
                                const chance = Math.floor(Math.random() * 10);
                                if (chance > 5) {
                                    finalSongs.push(possibleSongs[i]);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                } 
                return Spotify.getTracks(finalSongs);
            })
        }
    },
    getUserId: () => {
        accessToken = Spotify.getAccessToken()
        if(accessToken) {
            const headers = {Authorization: `Bearer ${accessToken}`};
            return fetch("https://api.spotify.com/v1/me", { headers: headers })
            .then(response => response.json())
            .then(jsonResponse => {
                if(jsonResponse) {
                    const { id, display_name, email, external_urls, images } = jsonResponse;
                    const profile = {
                        user_id: id,
                        email: email,
                        name: display_name,
                        image: images[0].url,
                        url: external_urls.spotify
                    }
                    return profile
                }
            })
        }
    },
    getTracks: async (idsArray) => {
        accessToken = Spotify.getAccessToken();
        if (accessToken) {
            const ids = idsArray.join(',');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            await delay(10000);
            return fetch(`https://api.spotify.com/v1/tracks?market=US&ids=${ids}`, {
                    headers: headers
                })
                .then(response => {
                    return response.json()
                })
                .then(jsonResponse => {
                    if (!jsonResponse.tracks) {
                        return []
                    }
                    let trackItem = jsonResponse.tracks.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        image: track.album.images[1].url,
                        uri: track.uri
                    }))
                    console.log(trackItem);
                    // Spotify.makePlaylist(trackItem);
                    addTrackOut(trackItem);
                })
        }
    },
    makePlaylist: (tracksList, title) => {
        accessToken = Spotify.getAccessToken()
        if(accessToken) {
            let tracksURIs = [];
            for(let i = 0; i < tracksList.length; i++){
                tracksURIs.push(tracksList[i].uri);
            }
            
            const headers= {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Content-Length': '0'
            };
            return fetch("https://api.spotify.com/v1/me", { headers: headers })
            .then(response => response.json())
            .then(jsonResponse => {
                if(jsonResponse) {
                    const { id } = jsonResponse;
                    return fetch(`https://api.spotify.com/v1/users/${id}/playlists`,
                    {method: 'POST',
                    body: JSON.stringify({
                        'name': `${title}`,
                        'public': true,
                    }),
                    headers: headers})
                    .then(response2 => response2.json())
                    .then(jsonResponse2 => {
                        const { id } = jsonResponse2 
                        fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${tracksURIs.join(',')}`, { headers: headers, method: 'POST'});
                    })
                }
            })
        }
    },
        search: (term) => {
        accessToken = Spotify.getAccessToken();
        if (accessToken) {
            const headers = {Authorization: `Bearer ${accessToken}`}
            return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: headers})
            .then(response => { return response.json() })
            .then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return []
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    image: track.album.images[1].url,
                    uri: track.uri
                }))
            })
        }
    }
}

export default Spotify