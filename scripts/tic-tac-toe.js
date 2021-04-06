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
                            ['1','2','3'],
                            ['4','5','6'],
                            ['7','','9']
                        ]
    function setCell([x, y], mark) {
        if (gameBoard[x][y] == '') {
            gameBoard[x][y] = mark;
        } else {
            return "Cell is not empty";
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
    
            for (let j=0; j < currentGridArray[i].length; j++) {
                let item = document.createElement("section");
                item.setAttribute("id",`item-${i}-${j}`)
                item.addEventListener("click", function() {
                    //GameBoard.setCell
                })
                
                item.textContent = currentGridArray[i][j];
                
                // append to row
                row.appendChild(item);
                
            }
            
            gameGridContainer.appendChild(row);
            
        }
    }


    return {displayGrid}
})();

let Game = (function () {
    'use strict';
    DisplayController.displayGrid();
    return {}
})();