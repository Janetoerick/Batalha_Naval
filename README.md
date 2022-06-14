# Batalha_Naval
Esse é uma implementação que busca simular o jogo batalha naval com a utilização de web socket.

## Rodando aplicação
Execute os seguintes comandos para executar o servidor:

```bash
#primeiro instale as dependências:
npm install

#em seguida ligue o servidor:
npm start
```

## Comandos
Existem 4 comandos:

### Novo jogo
#### Corpo
Primeiramente é necessário criar um jogo, para isso você deve criar uma requisição com o seguinte corpo:

```bash
{
  type:”newGame”,
  data:
  {
      player:
    {
        name: string,
        map_player: Array(Array(10) * 10),
    },
  }
}
```
Sendo "name" o nome do jogador1;

#### Resposta
Como resposta o servidor irá mandar um status "OK" e o id da sala

```bash
{
  type: 'ConnectionType',
  status: 'OK',
  idGame: int
}
```
#### Erros
O Servidor não irá retornar nenhum erro

### Entrar em uma sala
#### Corpo
Se o jogador quer entrar em uma sala já criada, basta ele enviar o id dela
 
```bash
{
  type:”introGame”,
  idGame: int,
  name: string, 
  map_player: Array(Array(10) * 10),
}
```
Sendo "idGame" o id da sala na qual o jogador que entrar, "name" o nome do jogador2;

#### Resposta
Como resposta o servidor irá enviar o id da sala:

```bash
{
  type: 'ConnectionType',
  status: 'OK',
  idGame: int
}
```

#### Erros
Se o nome dos dois jogadores for igual, o servidor irá enviar uma mensagem de erro com o seguinte corpo:

```bash
{
  type: 'ConnectionType',
  status: 'ERROR NAME',
  idGame: int
}
```


### Montar o seu campo
#### Corpo
Após dois jogadores entrarem em uma sala, o jogo só começará quando os dois distribuírem seus navios na matriz, quando isso ocorrer o cliente deve enviar uma requisição ao servidor com o seguinte corpo:
 
```bash
{
  type:”setMap”,
  idGame: int,
  name: string, 
  map_player: Array(Array(10) * 10),
}
```
Sendo "idGame" o id da sala na qual o jogador que entrar, "name" o nome do jogador que fez a requisição e map_player a array com os navios posicionados.

#### Resposta
Como resposta o servidor irá enviar a ambos os players o estado dos dois jogadores:

```bash
{
  type: 'startGame',
  idGame: game.id,
  status: game.player2.ready && game.player1.ready
}
```
Se o jogador1 estiver pronto para começar o jogo, entgame.player1.ready terá valor verdadeiro, o mesmo vale para o jogador 2.
Assim o valor de status será verdadeiro se ambos os jogadores estiverem prontos para jogar.

#### Erros
O servidor não enviará erros.


### Ataque!
#### Corpo
Após os dois jogadores estarem prontos para jogar, eles poderão atacar o adversário.
Para efetuar essa função basta enviar:

```bash
{
  type:”setMap”,
  idGame: int,
  name: string, 
  row: int,
  column: int,

}
```
Sendo "idGame" o id da sala do jogador, "name" o nome do jogador que fez a requisição,
"row" e "column" são, respectivamente a linha e a coluna do ataque.

#### Resposta
Como resposta o servidor irá enviar a ambos os players o player que irá jogar em seguida

```bash
{
    type: “attack”;
    idGame: int;
    round_player: string;

}
```
Se round_player fo igual ao round_player anterior significa que o jogador acertou um navio, senão significa que acertou a água.
Além disso, se o nome do jogador for igual a round_player significa que é a vez dele de jogar.

#### Erros
O servidor não enviará erros.
