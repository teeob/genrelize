document.getElementById('login').addEventListener('click', function() {
    //console.log('button works');

    // fetch('/login')
    // .then(resp => resp.json())
    // .then(function (data) {
    //     console.log(data);
    // })
    // .catch(err => console.log(err + ' error!'))

    fetch('/login')
    .then(function (resp) { 
        //console.log(resp); 
        return resp.text();
        //return resp.json();
    })
    .then(function (data) {
        //console.log(data);
        debugger;
        window.location = data;
    })
    .catch(err => console.log(err + ' ' + 'error!'))
})

// set access token
localStorage.setItem('accessToken', function () {
    const hash = window.location.hash;

    if(hash != null && hash != '') {
        return hash.substring(hash.indexOf('=') + 1, hash.indexOf('&'));
    }
}())

// const accessToken = function () {
//       const hash = window.location.hash;
   
//       if(hash != null && hash != ''){
//          return hash.substring(
//             hash.indexOf("=") + 1, 
//             hash.indexOf("&")
//          );
//       }
// }

// localStorage.setItem("accessToken", accessToken);

if(window.location.hash) {
    window.location = '/app.html';
}

// etch('/spotifyRedirectUri')
//       .then(e => e.json())
//       .then(data => {
//         window.location = data.redirectUri;
//       })
//       .catch(error => { alert("Failed to prepare for Spotify Authentication")});