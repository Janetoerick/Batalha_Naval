const ws = new WebSocket("ws://" + location.host);
let username;

ws.onmessage = (event) => {        
    console.log(event.data);
    const json = JSON.parse(event.data);
    console.log('json', json);
    if (json.type == 'broadcast') {
              
    } else if (json.type = "newGameCreated") {

    } else if (json.type = "ConnectionType") {

    } else if (json.type = "startGame") {

    } else if (json.type = "attack") {

    }
}

function send() {
    // verifica se o campo de texto da mensagem está vazio
    if (username.value == "") {
        alert("Por favor, digite um nome de usuário!");
        username.focus();
        return;
    }

    // Envia o texto digitado para o servidor pelo WebSocket (Um objeto convertido para string)
    var g = new Array();
    for (let index = 0; index < 10; index++) {
        g.push(new Array(10).fill(0));
    }
    ws.send(JSON.stringify({
        type: 'newGame', 
        name: username.value,
        map_player: g
    }));

    username.focus();
}


window.addEventListener('load', (e) => {
    console.log('load')
    username = document.getElementById('username');

    const matriz = document.getElementById("matriz");
    
    var elemento = document.createElement("div");
    elemento.setAttribute("class", "node");

    matriz.appendChild(elemento);
});
