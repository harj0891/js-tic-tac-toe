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
    getScore = function () {

    }
    setScore = function () {

    }
    
    return {getName, getMark, getScore, setScore};
}

// Game modules
let GameBoard = (function () {
    'use strict';
    let gameBoard = [
                            ['','',''],
                            ['','',''],
                            ['','','']
                        ]
    function setCell(x, y, mark) {
        console.log(gameBoard[x][y]);
        console.log(x, y);
        if (gameBoard[x][y] == '') {
            gameBoard[x][y] = mark;
            return true;
        } else {
            
            return false;
        }
        
    }
    return {gameBoard, setCell}
})();



let DisplayController = (function () {
    displayGrid = function() {
        let gameGridContainer = document.querySelector("#game-grid");
        let currentGridArray = GameBoard.gameBoard;
    
        // create a new grid and row per array element
        for (let i=0; i < currentGridArray.length; i++) {
            let row = document.createElement("section");
            row.setAttribute("id",`row-${i}`)
            row.setAttribute("class","row");
    
            for (let j=0; j < currentGridArray[i].length; j++) {
                let item = document.createElement("section");
                item.setAttribute("id",`item-${i}-${j}`)
                item.setAttribute("data-id",`${i}${j}`)
                item.setAttribute("class","item");
                item.addEventListener("click", function() {       
                    updateCell(item);
                })
                
                item.textContent = currentGridArray[i][j];
                
                // append to row
                row.appendChild(item);
                
            }
            
            gameGridContainer.appendChild(row);
            
        }
    }
    function updateCell(item) {
        let itemIdX = item.getAttribute("data-id").split("")[0];
        let itemIdY = item.getAttribute("data-id").split("")[1];
        let cellUpdated = GameBoard.setCell(itemIdX, itemIdY,'x');

        if (cellUpdated) {
            item.textContent = GameBoard.gameBoard[itemIdX][itemIdY];

        } else {
            console.log ("cell already occupied");
        }

    }

    return {displayGrid}
})();

let Game = (function () {
    'use strict';
    DisplayController.displayGrid();
    return {}
})();