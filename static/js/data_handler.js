// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    keyInLocalStorage: 'proman-data', // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _loadData: function() {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        this._data = JSON.parse(localStorage.getItem(this.keyInLocalStorage));
        if (!this._data) {
            this._data = sampleData;
        }
    },
    _saveData: function() {
        // it is not called from outside
        // saves the data from this._data to local storage
        localStorage.setItem(this.keyInLocalStorage, JSON.stringify(this._data));
    },
    init: function() {
        this._loadData();
    },
    getBoards: function(callback) {
        // the boards are retrieved and then the callback function is called with the boards
        callback(this._data.boards);
    },
    getBoard: function(boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        let boards = this._data.boards;
        let len = boards.length;
        for (let i=0; i<len; i++){
            if (boards[i].id === boardId){
                callback(boards[i]);
                break
            }
        }
    },
    getStatuses: function(callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        callback(this._data.statuses);
    },
    getStatus: function(statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        let statuses = this._data.statuses;
        let len = statuses.length;
        for (let i=0; i<len; i++){
            if (statuses[i].id === statusId){
                callback(statuses[i]);
                break
            }
        }
    },
    getCardsByBoardId: function(boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        let cards = this._data.cards;
        let len = cards.length;
        let filteredCards = [];
        for (let i=0; i<len; i++){
            if (cards[i].board_id === boardId){
                filteredCards.push(cards[i])
            }
        }
        callback(filteredCards);
    },
    getCard: function(cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
        let cards = this._data.cards;
        let len = cards.length;
        for (let i=0; i<len; i++){
            if (cards[i].id === cardId){
                callback(cards[i]);
                break
            }
        }
    },
    createNewBoard: function(boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        let boards = this._data.boards;
        let len = boards.length;
        let newId = 0;
        for (let i=0; i<len; i++){
            if (boards[i].id >= newId){
                newId = boards[i].id + 1;
            }
        }
        let newBoard = {
            "id": newId,
            "title": boardTitle,
            "is_active": false
        };
        this._data.boards.push(newBoard);
        this._saveData();
        callback([newBoard]);
    },
    createNewCard: function(cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        let cards = this._data.cards;
        let len = cards.length;
        let newId = 0;
        for (let i=0; i<len; i++){
            if (cards[i].id >= newId){
                newId = cards[i].id + 1;
            }
        }
        let newCard = {
            "id": newId,
            "title": cardTitle,
            "board_id": boardId,
            "status_id": statusId
        };
        this._data.cards.push(newCard);
        this._saveData();
        callback([newCard]);
    },
    // here comes more features
    updateCardStatusOrder: function (target) {
        let childNodes = target.childNodes;
        let cards = this._data.cards;
        let newOrder = 1;
        for (let childNode of childNodes){
            let cardId = childNode.dataset.cardid;
            for (card of cards) {
                if (card.id === Number(cardId)){
                    card.order = newOrder;
                    card.status_id = target.dataset.statusid;
                }
            }
            newOrder++;
        }
        this._data.cards = cards;
        this._saveData();
    },

    getCards: function(callback) {
        callback(this._data.cards);
    },

    editCard: function(cardId, cardTitle, callback) {
        this.getCards((cards) => {
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].id === cardId) {
                    cards[i].title = cardTitle;
                    this._saveData();
                    callback(cards[i]);
                    break;
                }
            }
        });
    },

    deleteBoard: function(boardId, callback) {
        let board = {};
        dataHandler.getBoards((boards) => {
            for (let i = 0; i < boards.length; i++) {
                if (boards[i].id === boardId) {
                    board = boards[i];
                    boards.splice(i, 1);
                    this.getCards((cards) => {
                        for (let j = cards.length - 1; j >= 0; j--) {
                            if (cards[j].board_id === board.id) {
                                cards.splice(j, 1);
                            }
                        }
                        this._data.cards = cards;
                    });
                    break;
                }
            }
            this._data.boards = boards;
            this._saveData();
            callback(board)
        });
    },
    deleteCardById: function(cardId){
        let cards = this._data.cards;
        let len = this._data.cards.length;
        let boardId = -1;
        for (let i=0; i<len; i++) {
            if (cards[i].id === Number(cardId)){
                boardId = cards[i].board_id;
                cards.splice(i, 1)
                break
            }
        }
        this._data.cards = cards;
        this._saveData();
    }
};
