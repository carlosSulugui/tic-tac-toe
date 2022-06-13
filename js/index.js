
let originalBoard; // se define tablero
const playerOne = 'O'; //jugador 1
const playerTwo = 'X'; // jugador 2
let playerTurn = true;
const winCombos = [ // combinaciones ganadoras
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];


const cells = document.querySelectorAll('.cell'); //instancia de casillas en documento html
start(); //llamada a funcion inicio

//funcion inicio 
function start() {

    originalBoard = Array.from(Array(9).keys());
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.removeProperty('color');
        cell.addEventListener('click',turnClick, false);
    })
}

//Determinar a que jugador le corresponde marcar 
function turnClick(square) {
    if(typeof originalBoard[square.target.id] == 'number') {
        
    turn(square.target.id, playerOne);
    if(!checkTie()) turn(bestSpot(), playerTwo); 
        
    }
    
}

//hacer jugada
function turn(squareId, player){
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(originalBoard, player);
    if(gameWon) gameOver(gameWon);
}

// verificar si alguno de los jugadores ha ganado
function checkWin(board, player) {
    let plays = board.reduce((a,e,i) => 
        (e === player)? a.concat(i): a, []);
    let gameWon = null;
    for(let [index,win] of winCombos.entries()) {
        if(win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {
                index: index,
                player: player
            }
            break;
        };
    }
    return gameWon;
}

//Verificar si el juego a terminado(gano jugador 1, gano jugador 2, empate)
function gameOver(gameWon) {
    for(let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.color = 
            gameWon.player === playerOne? 'blue' : 'red';
    }

    for(let i=0;i< cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === playerOne?'Ganó el jugador 1' : 'Ganó el jugador 2');
}

//alerta que muestra el jugador ganador
function declareWinner(who){
    alert(who);
}

//verificar que casillas estan libres
function emptySquares(board) {
    return board.filter(s => typeof s == 'number');
}

//elegir la mejor jugada para la IA
function bestSpot() {
    return minimax(originalBoard, playerTwo).index;
}

//Verificar si un jugador ha logrado una combinacion ganadora
function checkTie() {
    if(emptySquares(originalBoard).length === 0){
        cells.forEach(cell => {
            cell.style.color = 'green';
            cell.removeEventListener('click', turnClick, false);
        });
        declareWinner('Juego empatado!!');
        return true;
    }
    return false;
}

//algoritmo minimax
function minimax(newBoard, player) {

    let availableSpots = emptySquares(newBoard);
    

    if(checkWin(newBoard, playerOne)){
        return {score: -10};
    }else if(checkWin(newBoard, playerTwo)){
        return {score: 20};
    }else if(availableSpots.length === 0){
        return {score: 0};
    }

    let moves = [];

    for(let i=0;i<availableSpots.length; i++) {
        let move = {};

        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;

        if(player == playerTwo) {
            let result = minimax(newBoard, playerOne);
            move.score = result.score;
        }else{
            let result = minimax(newBoard, playerTwo);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if(player === playerTwo){
        let bestScore = -10000;
        for(let i = 0; i< moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i++;
            }
        }

    }else{
        let bestScore = 10000;
        for(let i=0;i<moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i++;
            }
        }
    }

    return moves[bestMove];
}