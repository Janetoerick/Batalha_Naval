const WebSocket = require('ws');

// para o mapa inimigo
const anything = 0;
const water = 1;
const boat = 2;

// para o mapa do player
const water_reached = 0;
const water_free = 1;
const boat_reached = 2;
const boat_free = 3;

let clients = [];

let games = []

let game = {
    id: null,
    player1: null,
    player2: null,
    winner: -1,
    game_start: false
};

let player = {
    name: null,
    map_player: null,
    map_enemy: null,
    ready: false
};
 
function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}
 
function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    const json = JSON.parse(data);
    ws.send(JSON.stringify({
        type: 'confirmation',
        data: 'Recebido'
    }));
    

    if (json.type == "newGame") { // criando novo jogo
        var g = JSON.parse(JSON.stringify(game));
        g.player1 = JSON.parse(JSON.stringify(player));
        g.player1.name = json.name;
        g.player1.map_player = json.map_player;
        g.player1.map_enemy = new Array();
        for (let i = 0; i < 10; i++) {
            g.player1.map_enemy.push(new Array(10).fill(0));
        }
        games.push(g);
        g.id = games.length;
        console.log(g.player1.name);
        ws.send(JSON.stringify({
            type: 'newGameCreated',
            data: 'Jogo criado',
            idGame: g.player1.name
        }));
    } else if (json.type == "introGame") { // entrando num jogo existente
        for (game in games) {
            if (json.idGame == game.id) { // achar o jogo
                if (json.name != game.player1.name) { // se o nome do jogador 2 for diferente do 1
                    game.player2 = JSON.parse(JSON.stringify(player));
                    game.player2.name = json.name;
                    game.player2.map_enemy = new Array();
                    for (let i = 0; i < 10; i++) {
                        game.player2.map_enemy.push(new Array(10).fill(0));
                    }
                    ws.send(JSON.stringify({
                        type: 'ConnectionType',
                        status: 'OK',
                        idGame: game.id
                    }));
                } else { // se os nomes forem iguais
                    ws.send(JSON.stringify({
                        type: 'ConnectionType',
                        status: 'ERROR NAME',
                        idGame: game.id
                    }));
                }
                break;
            }
        }
    } else if (json.type == "setMap") { // confirmando que esta pronto para jogar
        for (game in games) {
            if (json.idGame == game.id) {
                if (json.name == game.player1.name) {
                    game.player1.map_player = json.map_player;
                    game.player1.ready = true;
                } else {
                    game.player2.map_player = json.map_player;
                    game.player2.ready = true;
                }
                wp.send(JSON.stringify({
                    type: 'startGame',
                    idGame: game.id,
                    status: game.player2.ready && game.player1.ready
                }));
                break;
            }
        }
    } else if (json.type == "attack") { // comando de ataque
        for (game in games) {
            if (json.idGame == game.id) {
                if(json.name == game.player1.name){
                    if (game.player2.map_player[json.row][json.column] == boat_free) {
                        game.player1.map_enemy[json.row][json.column] == boat;
                        game.player2.map_player[json.row][json.column] == boat_reached;
                        ws.send(JSON.stringify({
                            type: 'attack',
                            idGame: game.id,
                            round_player: game.player1.name
                        }));
                    } else if (game.player2.map_player[json.row][json.column] == water_free) {
                        game.player1.map_enemy[json.row][json.column] == water;
                        game.player2.map_player[json.row][json.column] == water_reached;
                        ws.send(JSON.stringify({
                            type: 'attack',
                            idGame: game.id,
                            round_player: game.player2.name
                        }));
                    }
                } else if (json.name == game.player2.name) {
                    if (game.player1.map_player[json.row][json.column] == boat_free) {
                        game.player2.map_enemy[json.row][json.column] == boat;
                        game.player1.map_player[json.row][json.column] == boat_reached;
                        ws.send(JSON.stringify({
                            type: 'attack',
                            idGame: game.id,
                            round_player: game.player2.name
                        }));
                    } else if (game.player1.map_player[json.row][json.column] == water_free) {
                        game.player2.map_enemy[json.row][json.column] == water;
                        game.player1.map_player[json.row][json.column] == water_reached;
                        ws.send(JSON.stringify({
                            type: 'attack',
                            idGame: game.id,
                            round_player: game.player1.name
                        }));
                    }
                }
                break;
            }
        }
    }
}

function onClose(ws, reasonCode, description) {
    console.log(`onClose: ${reasonCode} - ${description}`);
    const index = clients.indexOf(ws);
    if (index > -1) {
        clients.splice(index, 1);
    }
}
 
function onConnection(ws, req) {
    clients.push(ws);
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    ws.on('close', (reasonCode, description) => onClose(ws, reasonCode, description));
    ws.send(JSON.stringify({
        type: 'connection',
        data: 'Bem vindo'
    }))
    console.log(`onConnection`);
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', onConnection);
 
    console.log(`App Web Socket Server is running!`);
    return wss;
}