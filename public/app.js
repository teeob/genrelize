
//document.getElementById('submit').addEventListener('click', function() {
    getUsersTopArtists();

    //console.log(localStorage.getItem('accessToken'));

    // query //https://api.spotify.com/v1/me/top/artists?limit=20&offset=20 //long_term(several years), medium_term(~6 mnths), short_term(~4wks)

    /*
     var genreObject = {
         genre : genre,
         artist : artiste,
         number : number
     }
     */


    function getUsersTopArtists () {
        fetch('https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=long_term', { 
            method : 'GET',
            headers : {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(resp => resp.json())
        //.then(data => console.log(data))
        .then(function (data) {
            //debugger;
            //console.log(data);
            var parentarr = [];

            var arr = [];
            let i = 1;
            data.items.forEach(function(e) {
                //;
                e.genres.forEach( function(gen) {
                    //debugger
                    if(arr.some(
                        //el => el.genre === gen)
                        function(el) {
                            if(el.genre === gen){
                                //debugger
                                el.artiste.push(e.name)
                                el.value += 1;
                                //debugger
                            }
                            return (el.genre === gen);
                        }
                        )){
                        //append the number for object
                        console.log('already exists');
                    }
                    else{
                        //debugger
                        arr.push({'id':i++, 'genre': gen, 'artiste': [e.name], 'value': 1});
                        //arr.push(gen);
                    }
                    //debugger
                })
                //console.log(arr);
            });
            parentarr.push({"name": "mousiki", "children" : arr});
            //JSON.stringify(arr);
            console.log(parentarr);
            ///////console.log(JSON.stringify(parentarr));
        })
        .catch(err => console.log('error ', err))
    }
///});
