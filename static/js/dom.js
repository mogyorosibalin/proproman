// It uses data_handler.js to visualize elements
let dom = {
    dragulaEvents: [],
    loadBoards: function() {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards((boards) => {
            this.showBoards(boards);
        });
    },
    showBoards: function(boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        const TYPES = ["danger", "warning", "primary", "success"];
        let boardTemplate = document.getElementById('board-template').innerHTML;
        for (let board of boards) {
            let tempBoardTemplate = boardTemplate;
            tempBoardTemplate = tempBoardTemplate.replace(/idData/g, board.id);
            tempBoardTemplate = tempBoardTemplate.replace(/titleData/g, board.title);
            this.appendToElement(document.getElementById('boards'), tempBoardTemplate);
            dataHandler.getStatuses((statuses) => {
                let statusTemplate = document.getElementById('status-template').innerHTML;
                for (let status of statuses) {
                    let tempStatusTemplate = statusTemplate;
                    let title = status.name;
                    if (status.id === 1) {
                        title += '<button type="button" data-target="#newCardModal" data-toggle="modal" class="btn btn-outline-danger btn-sm new-btn" onclick="dom.showNewCardModal(' + board.id + ')">New card <i class="fas fa-plus"></i></button>';
                    }
                    tempStatusTemplate = tempStatusTemplate.replace(/titleData/g, title);
                    tempStatusTemplate = tempStatusTemplate.replace(/statusIdData/g, 'status-' + status.id);
                    tempStatusTemplate = tempStatusTemplate.replace(/cardIdData/g, 'board-' + board.id + '-status-' + status.id);
                    tempStatusTemplate = tempStatusTemplate.replace(/statusDataset/g, status.id);
                    tempStatusTemplate = tempStatusTemplate.replace(/boardDataset/g, board.id);
                    tempStatusTemplate = tempStatusTemplate.replace(/colorData/g, TYPES[status.id - 1]);
                    this.appendToElement(document.getElementById('board-' + board.id).getElementsByClassName('row')[0], tempStatusTemplate);
                }
            });
            this.loadCards(board.id);
            let dragulaArray = [];
            for(let i=1; i<5; i++)
                dragulaArray.push(document.getElementById('board-' + board.id + '-status-' + String(i)))

            dragula(dragulaArray).on('drop', (element, target) => {
                dataHandler.updateCardStatusOrder(target);
            });
        }
    },
    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, (cards) => {
            this.showCards(cards);
        });
    },
    showCards: function(cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let taskTemplate = document.getElementById('task-template').innerHTML;
        cards = cards.sort(function (a,b) {
            return a.order - b.order;
        });
        for (let card of cards) {
            let tempTaskTemplate = taskTemplate;
            tempTaskTemplate = tempTaskTemplate.replace(/idData/g, card.id);
            tempTaskTemplate = tempTaskTemplate.replace(/titleData/g, card.title);
            tempTaskTemplate = tempTaskTemplate.replace(/cardDataset/g, card.id);
            tempTaskTemplate = tempTaskTemplate.replace(/orderDataset/g, card.order);
            this.appendToElement(document.getElementById('board-' + card.board_id).getElementsByClassName('status-' + card.status_id + '-tasks')[0], tempTaskTemplate);
        }
        this.showGetStarted();
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
        let boardTitle = document.getElementById('new-board-title').value;
        let errorDiv = document.getElementById('newBoardModal').getElementsByClassName('error')[0];
        if (boardTitle.length < 5) {
            errorDiv.innerHTML = "The Board title must contain at least 5 characters!";
            errorDiv.style.display = 'block';
        } else {
            errorDiv.innerHTML = "";
            errorDiv.style.display = 'none';
            document.getElementById('new-board-title').value = '';
            document.getElementById('closeBoardModal').click();
            dataHandler.createNewBoard(boardTitle, (board) => {
                this.showBoards(board);
            });
        }
    },
    showNewCardModal: function(boardId) {
        document.getElementById('boardIdForNewCard').value = boardId;
    },
    cardHandler: function() {
        let boardId = parseInt(document.getElementById('boardIdForNewCard').value);
        let cardId = parseInt(document.getElementById('cardIdForEditCard').value);
        let cardTitle = document.getElementById('new-card-title').value;
        let errorDiv = document.getElementById('newCardModal').getElementsByClassName('error')[0];
        if (cardTitle.length < 5) {
            errorDiv.innerHTML = "The Card title must contain at least 5 characters!";
            errorDiv.style.display = 'block';
        } else {
            errorDiv.innerHTML = "";
            errorDiv.style.display = 'none';
            document.getElementById('new-card-title').value = '';
            document.getElementById('closeCardModal').click();
            if (boardId >= 0) {
                this.addNewCard(boardId, cardTitle);
            }
            if (cardId >= 0) {
                this.editCard(cardId, cardTitle);
            }
        }
    },
    addNewCard: function(boardId, cardTitle) {
        document.getElementById('boardIdForNewCard').value = "";
        dataHandler.createNewCard(cardTitle, boardId, 1, (card) => {
            this.showCards(card);
        });
    },
    showEditCard: function(cardId) {
        document.getElementById('cardIdForEditCard').value = cardId;
        dataHandler.getCard(cardId, (card) => {
            document.getElementById('new-card-title').value = card.title;
        });
    },
    editCard: function(cardId, cardTitle) {
        document.getElementById('cardIdForEditCard').value = "";
        dataHandler.editCard(cardId, cardTitle, (card) => {
            this.updateCard(card);
        });
    },
    updateCard: function(card) {
        let cards = document.getElementById('board-' + card.board_id).getElementsByClassName('task');
        for (let fakeCard of cards) {
            if (parseInt(fakeCard.dataset.id) === card.id) {
                fakeCard.getElementsByTagName('span')[0].innerHTML = card.title;
                break;
            }
        }
    },
    showDeleteBoard: function(boardId) {
        dataHandler.getBoard(boardId, (board) => {
            if (confirm('Do you really want to delete this board: ' + board.title + '?')) {
                dataHandler.deleteBoard(boardId, (deletedBoard) => {
                    document.getElementById('board-' + deletedBoard.id).remove();
                });
            } else {
                document.getElementById('board-' + boardId + '-heading').click();
            }
        });


    },
    showDeleteCard: function(cardId) {
        if (confirm('Are you sure?') === true){
            dataHandler.deleteCardById(cardId);
            document.getElementById(cardId).remove();
        }
    },
    showUsername: function (username) {
        document.getElementById('username').innerHTML = 'You are logged in as ' + username;
    },
    showGetStarted: function (show=null) {
        console.log(show);
        if (show === null){
            dataHandler.getStarted( (show) => {this.showGetStarted(show)})
        }
        else if (show) {
            document.getElementById('get-started').innerHTML = 'Click on <span>NEW BOARD\n '+
                                                                '<i class=\"fas fa-plus\"></i></span>'+
                                                                ' to create a new board';
        }
        else {
           document.getElementById('get-started').style.display = 'none'
        }
    }
};
