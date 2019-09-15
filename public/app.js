const accessToken = localStorage.getItem('access_token');
const accessTokenExpiresIn = localStorage.getItem('expires_in');
const tokenType = localStorage.getItem('token_type');

if(!accessToken || parseInt(localStorage.getItem('expires_in')) < Date.now()) {
    window.location = '/';
}

(function getUsersTopArtists () {
    fetch('https://api.spotify.com/v1/me/top/artists?limit=20&offset=0&time_range=long_term', { //move to variable for options?
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

        console.log(parent); //delete later
    })
    .catch(e => console.log(e))

    //document.getElementById("widget").src = "https://open.spotify.com/embed/album/5GWoXPsTQylMuaZ84PC563";

    drawD3Chart();
})();

function sort(topArtists){
    let result = [];

    topArtists.items.forEach(artist => {
        artist.genres.forEach(genre => {
            if(result.some( 
                e => {
                    if(e.genre === genre) {
                        e.artists.push(artist.name);
                        e.value = e.artists.length; //or +=1
                    }
                    return (e.genre === genre)
                }
            )){}//add to log file if genre already exists
            else{
                result.push({'genre': genre, 'artists': [artist.name], 'value': 1});
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

