
const opponentType = "cpu";


// Player factory
let Player = (id, name, mark) => {
    this.id = id;
    this.name = name;
    this.mark = mark;
    getID = function() {
        return id;
    }
    getName = function () {
        return name;
    }
    getMark = function () {
        return mark;
    }
    
    return {getID, getName, getMark};
}

// Player CPU factory
let PlayerCPU = (id, name, mark, difficulty) => {
    const prototype = Player (id, name, mark);

    let makeMove = function () {
        let gameBoard = GameBoard.getBoard();

        if (difficulty == "easy") {
            let availableMoves = [];

            for (let i=0; i < gameBoard.length; i++) {
                for (let j=0; j < gameBoard[i].length; j++) {
                    if (gameBoard[i][j] == '') {
                        availableMoves.push([i,j]);
                    }
                }
            }

            let randomNum = Math.floor(Math.random() * availableMoves.length);
            let selectRandomMove = availableMoves[randomNum];

            return selectRandomMove;

        } else if (difficulty == "hard") {

        }
        
    }

    return Object.assign({}, prototype, {makeMove});
}

// Game modules
let GameBoard = (function () {
    'use strict';
    let gameBoard =  
        [
            ['','',''],
            ['','',''],
            ['','','']                 
        ]
    function setCell(x, y, mark) {
        if (gameBoard[x][y] == '') {
            gameBoard[x][y] = mark;
            return true;
        } else {
            
            return false;
        }
        
    }

    function getBoard() {
        return gameBoard;
    }

    function setBoard(board) {
        gameBoard = board;
    }

    function resetBoard() {
        for (let i=0; i < gameBoard.length; i++) {
            for (let j=0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = '';
            }
        }
    }
    return {setCell, getBoard, setBoard, resetBoard}
})();




let DisplayController = (function () {
    let resultModalContainer = document.querySelector("#game-result-modal");
    let playersContainer = document.querySelector("#players-info");
    let gameGridContainer = document.querySelector("#game-grid");
    let currentGridArray = GameBoard.getBoard();
    let resultModal =  document.querySelector("#game-result-value");
    
    // add event listener on reset button
    let restartButtonMain = document.querySelector("#restart");
    restartButtonMain.addEventListener("click",function(){
        Game.restartGame();
    });

    // add event listener on reset button
    let restartButtonModal = document.querySelector("#modal-restart");
    restartButtonModal.addEventListener("click",function(){
        Game.restartGame();
    });

    function displayPlayers(player1, player2) {
        // reset existing
        playersContainer.innerHTML = "";

        let player1Element = document.createElement("p");
        player1Element.setAttribute("class", "player1 player-focus");
        player1Element.textContent = `${player1.getName()}`;
        playersContainer.appendChild(player1Element);

        let player2Element = document.createElement("p");
        player2Element.setAttribute("class", "player2");      
        player2Element.textContent = `${player2.getName()}`;
        playersContainer.appendChild(player2Element);
    }

    function setPlayerFocus(player) {
        let currentPlayerElement;
        let otherPlayerElement;

        if (player.getID() == 1) {
            currentPlayerElement = document.querySelector(".player1");
            otherPlayerElement = document.querySelector(".player2");
        } else if (player.getID() == 2) {
            currentPlayerElement = document.querySelector(".player2");
            otherPlayerElement = document.querySelector(".player1");
        }

        currentPlayerElement.classList.add("player-focus");
        otherPlayerElement.classList.remove("player-focus");
    }

    function displayGrid() {
        // reset existing results and game grid
        resultModalContainer.style.display = "none";
        resultModal.innerHTML = "";
        gameGridContainer.innerHTML = "";
        

        // create a new grid and row per array element
        for (let i=0; i < currentGridArray.length; i++) {
            for (let j=0; j < currentGridArray[i].length; j++) {
                let item = document.createElement("section");
                let itemValue = document.createElement("p");
                itemValue.setAttribute("id",`val-${i}-${j}`)
                itemValue.setAttribute("class","value");

                item.setAttribute("id",`item-${i}-${j}`)
                item.setAttribute("data-id",`${i}${j}`)
                item.setAttribute("class","item");
                item.addEventListener("click", function() {
                    
                    let turnInProgress = Game.isTurnInProgress();
                    if (!turnInProgress) {
                        Game.playTurn(item, itemValue);
                    }
                })
                
                itemValue.textContent = currentGridArray[i][j];
                item.appendChild(itemValue);

                // append to grid
                gameGridContainer.appendChild(item);                
            } 
        }
    }



    function displayCell(itemValue,itemIdX,itemIdY) {
        itemValue.setAttribute("class",`value val-${currentGridArray[itemIdX][itemIdY]}`);
        itemValue.textContent = currentGridArray[itemIdX][itemIdY];
    }

    function displayResult(winnerName, winningRow) {
        let resultElement = document.createElement("p");

        if (winningRow == "tie") {
            resultElement.textContent = "It is a tie!";
        } else {
            // set all to default colour
            let allValues = document.querySelectorAll(".value");

            allValues.forEach(value => {
                value.setAttribute("class","val-default");
            })

            // set winning row
            for (let i=0; i < winningRow.length; i++) {
                let x = winningRow[i][0];
                let y = winningRow[i][1];
                let winningVal = document.querySelector(`#val-${x}-${y}`);
                winningVal.setAttribute("class","val-win");
            }
    
            resultElement.textContent = `${winnerName} has won!`;
        }

        resultModal.appendChild(resultElement);
        resultModalContainer.style.display = "block";
    }

    return {displayPlayers, setPlayerFocus, displayGrid, displayCell, displayResult}
})();


let Game = (function () {
    'use strict';    
    let player1;
    let player2;
    let currentPlayer;
    let turnInProgress;
    
    startGame(opponentType);


    function isTurnInProgress () {
        return turnInProgress;
    };

    function startGame(opponentType) {
        // setup players
        player1 = Player(1, "Player 1", "x");

        if (opponentType == "player") {
            player2 = Player(2, "Player 2", "o");
        } else if (opponentType == "cpu") {
            player2 = PlayerCPU(2, "CPU (Easy)", "o","easy");
        }

        currentPlayer = player1;
        turnInProgress = false;

        // setup display
        DisplayController.displayPlayers(player1, player2);
        DisplayController.displayGrid();
    }

    function playCPUTurn() {
        let playerMove = player2.makeMove();

        // get grid item and pass into playTurn function
        let x = playerMove[0];
        let y = playerMove[1];
        let item = document.querySelector(`#item-${x}-${y}`);
        let itemText = document.querySelector(`#val-${x}-${y}`);

        
        return playTurn(item, itemText);
    }

    function playTurn(item, itemText) {
        turnInProgress = true;

        let delayInMilliseconds = 1000; 
        let playerMark = currentPlayer.getMark();
        let playerName = currentPlayer.getName();
        let winningRow = checkWinner(playerMark);

        // check for winner
        if (winningRow) {
            return DisplayController.displayResult(playerName,winningRow);                
        }
       

        // make move - update game cell and display       
        let itemIdX = item.getAttribute("data-id").split("")[0];
        let itemIdY = item.getAttribute("data-id").split("")[1];
        GameBoard.setCell(itemIdX, itemIdY,playerMark);
        DisplayController.displayCell(itemText,itemIdX,itemIdY)

        // check for winner after making move
        winningRow = checkWinner(playerMark);
        if (winningRow) {
            return DisplayController.displayResult(playerName,winningRow);                
        } 
            
        
        // switch player turn
        if (currentPlayer == player1) {
            
            //set to player 2
            currentPlayer = player2;
            DisplayController.setPlayerFocus(currentPlayer);

            // cpu play turn
            if (opponentType == "cpu") {
                setTimeout(function() {
                    playCPUTurn();
                    // finish turn
                    turnInProgress = false;
                }, delayInMilliseconds);
            } else {
                // finish turn
                turnInProgress = false;
            }

        } else if (currentPlayer == player2) {
            //set to player 1
            currentPlayer = player1;
            DisplayController.setPlayerFocus(currentPlayer);
            
            // finish turn
            turnInProgress = false;
        }                

    }

    function checkWinner(mark) {
        let currentGridArray = GameBoard.getBoard();
        
        // check col
        if (currentGridArray[0][0] == mark && currentGridArray[0][1] == mark && currentGridArray[0][2] == mark) {
            return [[0,0],[0,1],[0,2]];
        } else if (currentGridArray[1][0] == mark && currentGridArray[1][1] == mark && currentGridArray[1][2] == mark) {
            return [[1,0],[1,1],[1,2]];
        } else if (currentGridArray[2][0] == mark && currentGridArray[2][1] == mark && currentGridArray[2][2] == mark) {
            return [[2,0],[2,1],[2,2]];
        } 

        // check columns
        if (currentGridArray[0][0] == mark && currentGridArray[1][0] == mark && currentGridArray[2][0] == mark) {
            return [[0,0],[1,0],[2,0]];
        } else if (currentGridArray[0][1] == mark && currentGridArray[1][1] == mark && currentGridArray[2][1] == mark) {
            return [[0,1],[1,1],[2,1]];
        } else if (currentGridArray[0][2] == mark && currentGridArray[1][2] == mark && currentGridArray[2][2] == mark) {
            return [[0,2],[1,2],[2,2]];
        } 

        // check diagnals
        if (currentGridArray[0][0] == mark && currentGridArray[1][1] == mark && currentGridArray[2][2] == mark) {
            return [[0,0],[1,1],[2,2]];
        } else if (currentGridArray[0][2] == mark && currentGridArray[1][1] == mark && currentGridArray[2][0] == mark) {
            return [[0,2],[1,1],[2,0]];
        } 

        // check tie
        let isTie = checkTie(currentGridArray);
        if (isTie) {
            return "tie";
        }

    }

    function checkTie(currentGrid) {
        let currentGridArray = currentGrid;
        let isTie = true;

        for (let i=0; i < currentGridArray.length; i++) {
            for (let j=0; j < currentGridArray[i].length; j++) {
                let item = currentGridArray[i][j];
                if (item == '') {
                    isTie = false;
                }
            }
        }

        return isTie;
    }

    function restartGame() {
        GameBoard.resetBoard();
        startGame(opponentType);
    }

    return {isTurnInProgress, playTurn, restartGame}
})();
