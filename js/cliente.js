const ws = new WebSocket("ws://" + location.host);

window.addEventListener('load', (e) => {
    console.log('load')
    username = document.getElementById('username');
    msg = document.getElementById('message');
    chat = document.getElementById('chat');
});
