"use strict";

const accessToken = localStorage.getItem('access_token');
const accessTokenExpiresIn = localStorage.getItem('expires_in');
const tokenType = localStorage.getItem('token_type');

if(!accessToken || parseInt(localStorage.getItem('expires_in')) < Date.now()) {
    window.location = '/';
}

(function getUsersTopArtists () {
    fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term', { //move to variable for options?
    //fetch('https://api.spotify.com/v1/me/top/artists?limit=25', { //there seems to be a ~17% increase in genres by increase from 20 - 25 artistes
        method : 'GET',
        headers : {
            Authorization: `${tokenType} ${accessToken}`
        }
    })
    .then(res => res.json())
    .then(function (topArtists) {
        let parent = [];
        let children = sort(topArtists);

        parent.push({"name": "your top genres", "children" : children});

        if (parent && parent.length)
            save(parent);
    })
    .catch(e => console.log(e))

    getCurrentUser();
    drawD3Chart();
    //document.getElementById("widget").src = "https://open.spotify.com/embed/album/5GWoXPsTQylMuaZ84PC563";
})();

(function getUsersTopTracks() {
    fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term', {
        method : 'GET',
        headers : {
            Authorization: `${tokenType} ${accessToken}`
        } 
    })
    .then(res => res.json())
    .then(function (data, ...tracks) {
        data.items.forEach(track => {
            tracks.push(track.uri);
        })

        add(tracks, '6Nao3rMGoXHaFd0QAcTKPc');
    })
    .catch(e => console.log(e))
})();

function sort(topArtists){
    let result = [];

    topArtists.items.forEach(artist => {
        artist.genres.forEach(genre => {
            if(result.some( 
                e => {
                    if(e.genre === genre) {
                        e.artists.push({
                            name : artist.name, 
                            id : artist.id, 
                            popularity : artist.popularity
                        });

                        //sort artist by popularity, makes things easier in the future
                        e.artists.sort((a,b)=> a.popularity - b.popularity);

                        e.value = e.artists.length; //or +=1
                    }
                    return (e.genre === genre)
                }
            )){}//add to log file if genre already exists
            else{
                result.push({
                    genre : genre, 
                    artists : [{
                        name : artist.name, 
                        id : artist.id, 
                        popularity : artist.popularity
                    }], 
                    value : 1
                });
            }
        })
    });
    
    return result.sort((a,b) => b.value - a.value);
}

function save(parent) {
    fetch('/save', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parent[0]) 
        /*
        serialize json body with json.stringify
        serialize - turn parrent obj to memory so it can be saved
        */
    })
    .catch(e => console.log(e))
}

function add(tracks, toPlaylist_id) {
    fetch(`https://api.spotify.com/v1/playlists/${toPlaylist_id}/tracks?uris=${tracks}`, {
        method : 'PUT',
        headers : {
            Authorization: `${tokenType} ${accessToken}`
        }
    })
    .then(document.getElementById('widget').contentWindow.location.reload(true))
    .catch(e => console.log(e))
}

// function createPlaylist() {
//     fetch(`https://api.spotify.com/v1/playlists/${toPlaylist_id}/tracks?uris=${tracks}`, {
//         method : 'PUT',
//         headers : {
//             Authorization: `${tokenType} ${accessToken}`
//         }
//     })
//     .then(document.getElementById('widget').contentWindow.location.reload(true))
//     .catch(e => console.log(e))
// }

function getCurrentUser() { 
    fetch(`https://api.spotify.com/v1/me`, {
        method : 'GET',
        headers : {
            Authorization: `${tokenType} ${accessToken}`
        }
    })
    .then(res => res.json())
    .then(data => localStorage.setItem('user_id', data.id))
    .catch(e => console.log(e))
}

/*
function getRecommendationsBasedOn(seedArtists) {
    //let newarray = [];

    fetch(`https://api.spotify.com/v1/recommendations?limit=50&seed_artists=${seedArtists}`, {
        method : 'GET',
        headers : {
            Authorization: `${tokenType} ${accessToken}`
        }
    })
    .then(res => res.json())
    .then(function (data, ...newarray) {
        data.tracks.forEach(element => {
            newarray.push(element.uri);
        });
    })
    .catch(e => console.log(e))
}
*/