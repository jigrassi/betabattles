var ready = false;
var username = null;

function setUsername() {
    username = prompt("Enter your username");
    if(username != null){
        document.getElementById('username').innerHTML = 'You:' + username;
    }
}

function toggleReady() {
    if(username != null) {
        ready = !ready;
        document.getElementById('playerStatus').innerHTML = ready ? "Your Status: Ready" : "Your Status: Not Ready"
    } else {
        setUsername();
    }

}