const accessToken = localStorage.getItem('access_token');
const accessTokenExpiresIn = localStorage.getItem('expires_in');
const tokenType = localStorage.getItem('token_type');

if(!accessToken || parseInt(localStorage.getItem('expires_in')) < Date.now()) {
    window.location = '/';
}

(function getUsersTopArtists () {
    fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term', { //move to variable for options?
    //fetch('https://api.spotify.com/v1/me/top/artists?limit=25', { //there seems to be a ~17% increase in genres by increse from 20 - 25 artistes
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
    //.then(data => console.log(data))
    .catch(e => console.log(e))
})();

function sort(topArtists){
    let result = [];

    topArtists.items.forEach(artist => {
        artist.genres.forEach(genre => {
            if(result.some( 
                e => {
                    if(e.genre === genre) {
                        e.artists.push({'name' : artist.name, 'id' : artist.id, 'popularity' : artist.popularity});

                        //sort artist by popularity, makes things easier in the future
                        e.artists.sort((a,b)=> a.popularity - b.popularity);

                        e.value = e.artists.length; //or +=1
                    }
                    return (e.genre === genre)
                }
            )){}//add to log file if genre already exists
            else{
                result.push({'genre': genre, 'artists': [{'name' : artist.name, 'id' : artist.id, 'popularity' : artist.popularity}], 'value': 1});
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

// function createNewPlaylistFor(user) {

//     Promise.all([
//     fetch(`https://api.spotify.com/v1/users/${user}/playlists`, {
//         method : 'POST',
//         headers : {
//             Authorization: `${tokenType} ${accessToken}`
//         }
//     })
//     ])
//     .catch(e => console.log(e))
// }

// curl -X 
//  "" -H 
//  "Authorization: Bearer {your access token}" -H 
//  "Content-Type: application/json" --data
//   "{\"name\":\"A New Playlist\", \"public\":false}"

// //   Promise.all([
// //     fetch("http://localhost:3000/items/get"),
// //     fetch("http://localhost:3000/contactlist/get"),
// //     fetch("http://localhost:3000/itemgroup/get")
// //   ]).then(([items, contactlist, itemgroup]) => {
// //       ReactDOM.render(
// //           <Test items={items} contactlist={contactlist} itemgroup={itemgroup} />,
// //           document.getElementById('overview');
// //       );
// //   }).catch((err) => {
// //       console.log(err);
// //   });