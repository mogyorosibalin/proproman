// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function() {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards((boards) => {
            this.showBoards(boards);
        });
    },
    showBoards: function(boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardTemplate = document.getElementById('board-template').innerHTML;
        for(board of boards) {
            let tempBoardTemplate = boardTemplate;
            tempBoardTemplate = tempBoardTemplate.replace(/idData/g, String(board.id));
            tempBoardTemplate = tempBoardTemplate.replace(/titleData/g, board.title);
            console.log(tempBoardTemplate);
            let created = this.appendToElement(document.getElementById('boards'), tempBoardTemplate);
            created.style.display = 'block'
        }
    },
    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function(cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    appendToElement: function(elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    // here comes more features
    addNewBoard: function() {
        // add a new board, and display the boards again
        let boardTitle = document.getElementById('new-board-title').value;
        document.getElementById('new-board-title').value = '';
        dataHandler.createNewBoard(boardTitle, (boards) => {
            this.showBoards(boards);
        });
    },
};
