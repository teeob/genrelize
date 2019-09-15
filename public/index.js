(function() {
    document.getElementById('login').addEventListener('click', function() {
    fetch('/authorize')
    .then(response => response.clone().json().catch(() => response.text()).then(result => window.location = result))
    .catch(error => console.log(error + ' ' + 'error authorizing user'))
    })

    if(window.location.hash) {
        let hash = parse(window.location.hash);
        let expiryTime = Date.now() + (1000 * hash['expires_in']);

        localStorage.setItem('access_token', hash['access_token']);
        localStorage.setItem('expires_in', expiryTime);
        localStorage.setItem('token_type', hash['token_type']);

        if(hash['access_token'] && parseInt(localStorage.getItem('expires_in')) > Date.now()) {
            window.location = '/app.html';
        }
    }

    function parse(hash){
        let result = {}

        hash.slice(1).split("&").reduce(function (accumulator, currentValue){
            let splitValue = currentValue.split("=");

            result[splitValue[0]] = splitValue[1];
        }, hash.length)

        return result;
    }
})();