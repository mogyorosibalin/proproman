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
        for (let board of boards) {
            let tempBoardTemplate = boardTemplate;
            tempBoardTemplate = tempBoardTemplate.replace(/idData/g, 'board-' + board.id);
            tempBoardTemplate = tempBoardTemplate.replace(/titleData/g, board.title);
            this.appendToElement(document.getElementById('boards'), tempBoardTemplate);
            dataHandler.getStatuses((statuses) => {
                let statusTemplate = document.getElementById('status-template').innerHTML;
                for (let status of statuses) {
                    let tempStatusTemplate = statusTemplate;
                    let title = status.name;
                    if (status.id === 1) {
                        title += '<button type="button" class="btn btn-link btn-sm new-btn">Add new</button>';
                    }
                    tempStatusTemplate = tempStatusTemplate.replace(/titleData/g, title);
                    this.appendToElement(document.getElementById('board-' + board.id).getElementsByClassName('row')[0], tempStatusTemplate);
                }
            });
        }
    },
    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, (cards) => {
            this.showCards(boardId, cards);
        });
    },
    showCards: function(boardId, cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        dataHandler.getStatuses((statuses) => {
            let board = document.getElementById('board-' + boardId).getElementsByClassName('col')[0];
            let boardDetails = document.createElement('div');
            boardDetails.setAttribute('id', 'collapse-' + boardId);
            boardDetails.setAttribute('class', 'row card-containers collapse show');
            boardDetails.setAttribute('data-parent', '#board');
            for (let status of statuses) {
                let text = '<div class="col col-12 col-xl-3 col-lg-3 col-md-3 card-container">';
                text += '<h4 class="h4">' + status.name + '</h4>';
                text += '<div class="col col-12 status">';
                for (let card of cards) {
                    if (card.status_id === status.id) {
                        text += '<div class="card">' + card.title + '</div>';
                    }
                }
                text += '</div>';
                text += '</div>';
                boardDetails.innerHTML += text;
            }
            board.appendChild(boardDetails);
        });
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
