// Player factory
let Player = (name, mark) => {
    this.name = name;
    this.mark = mark;
    getName = function () {
        return name;
    }
    getMark = function () {
        return mark;
    }
    
    return {getName, getMark};
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
        console.log("game restart clicked");
        Game.restartGame();
    });

    // add event listener on reset button
    let restartButtonModal = document.querySelector("#modal-restart");
    restartButtonModal.addEventListener("click",function(){
        console.log("game restart clicked");
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

        if (player.getName() == "Player 1") {
            currentPlayerElement = document.querySelector(".player1");
            otherPlayerElement = document.querySelector(".player2");
        } else if (player.getName() == "Player 2") {
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
                    Game.playTurn(item, itemValue);
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
    let player1 = Player("Player 1", "x");
    let player2 = Player("Player 2", "o");
    let currentPlayer = player1;
    
    startGame();

    function startGame() {
        DisplayController.displayPlayers(player1, player2);
        DisplayController.displayGrid();
    }

    function playTurn(item, itemText) {
        let playerMark = currentPlayer.getMark();
        let playerName = currentPlayer.getName();
        let winningRow = checkWinner(playerMark);
        
        if (winningRow) {
            DisplayController.displayResult(playerName,winningRow);

        } else {
            let itemIdX = item.getAttribute("data-id").split("")[0];
            let itemIdY = item.getAttribute("data-id").split("")[1];

            // update game cell and display
            let gameBoardUpdated = GameBoard.setCell(itemIdX, itemIdY,playerMark);
            DisplayController.displayCell(itemText,itemIdX,itemIdY)

            // check winner
            winningRow = checkWinner(playerMark);

            if (winningRow) {
                DisplayController.displayResult(playerName,winningRow);                
            } else {
                if (gameBoardUpdated && currentPlayer == player1) {
                    
                    currentPlayer = player2;
                    DisplayController.setPlayerFocus(currentPlayer);
                } else if (gameBoardUpdated && currentPlayer == player2) {
                    currentPlayer = player1;
                    DisplayController.setPlayerFocus(currentPlayer);
                }    
            }
            
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
        currentPlayer = player1;

        DisplayController.displayPlayers(player1, player2);
        DisplayController.displayGrid();
    }

    return {playTurn, restartGame}
})();

