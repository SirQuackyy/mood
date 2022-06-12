const clientId = '6a2a92b3c1694082b94fe135954273fb'
const redirectUri = encodeURIComponent("http://localhost:3000/")
const scopes = encodeURIComponent("user-read-private user-read-email playlist-modify-public")

let accessToken

const Spotify = {
    getAccessToken : () => {
        if(localStorage.getItem('accessToken')){
            return JSON.parse(localStorage.getItem('accessToken'));
        }
        accessToken = window.location.hash.substring(1)
        .split('&')
        .reduce((initial, item) => {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {}).access_token;
        if(accessToken) {
            localStorage.setItem('accessToken', JSON.stringify(accessToken));
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`;
            window.location = accessUrl;
        }
    },
    getUserTop: () => {
        accessToken = Spotify.getAccessToken()
        if(accessToken) {
            const headers = { Authorization: `Bearer ${accessToken}`};
            return fetch("https://api.spotify.com/v1/me/top/artists?", { headers: headers })
            .then(response => response.json())
            .then(jsonResponse => {
                if(jsonResponse){
                    const { items } = jsonResponse;
                    const genres = new Map();
                    for(let i = 0; i < items.length; i++){
                        for(let j = 0; j < items[i].genres.length; j++){
                            if(genres.has(items[i].genres[j])){
                                genres.set(items[i].genres[j], genres.get(items[i].genres[j]) + 1);
                            } else {
                                genres.set(items[i].genres[j], 1);
                            }
                        }
                    }
                    return genres;
                }
            })
        }
    },
    getUserId: () => {
        accessToken = Spotify.getAccessToken()
        if(accessToken) {
            const headers = { Authorization: `Bearer ${accessToken}` };
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
    search : (term) => {
        accessToken = Spotify.getAccessToken()
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


