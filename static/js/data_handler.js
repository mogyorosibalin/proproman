// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    keyInLocalStorage: 'proman-data', // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _loadData: function(callback) {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        this._data = JSON.parse(localStorage.getItem(this.keyInLocalStorage));
        if (!this._data) {
            let object = this;
            $.ajax({
                type: 'post',
                url: '/get-data',
                data: {},
                dataType: 'json',
                success: function (data) {
                    localStorage.setItem(object.keyInLocalStorage, JSON.stringify(data));
                    object._data = data;
                    callback();
                }
            });
        } else {
            callback();
        }
    },
    _saveData: function() {
        // it is not called from outside
        // saves the data from this._data to local storage
        localStorage.setItem(this.keyInLocalStorage, JSON.stringify(this._data));
    },
    init: function(callback) {
        this._loadData(callback);
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
        $('.loading-alert').addClass('active');
        let thisObject = this;
        $.ajax({
            type: 'post',
            url: '/add-board',
            data: {'title': boardTitle},
            dataType: 'json',
            success: function (data) {
                console.log(data);
                let newBoard = {
                    "id": data.newId,
                    "title": boardTitle,
                };
                thisObject._data.boards.push(newBoard);
                thisObject._saveData();
                $('.loading-alert').removeClass('active');
                callback([newBoard]);
                showSuccessMessage(data.message);
            }
        });
    },
    createNewCard: function(cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        let thisObject = this;
        $('.loading-alert').addClass('active');
        $.ajax({
            type: 'post',
            url: '/add-card',
            data: {'title': cardTitle, 'board_id': boardId, 'status_id': statusId},
            dataType: 'json',
            success: function (data) {
                let newCard = {
                    "id": data.newId,
                    "title": cardTitle,
                    "board_id": boardId,
                    "status_id": statusId
                };
                thisObject._data.cards.push(newCard);
                thisObject._saveData();
                $('.loading-alert').removeClass('active');
                callback([newCard]);
                showSuccessMessage(data.message);
            }
        });
    },
    // here comes more features
    updateCardStatusOrder: function (target) {
        let thisObject = this;
        let childNodes = target.childNodes;
        let cards = this._data.cards;
        let newOrder = 1;
        $('.loading-alert').addClass('active');
        for (let childNode of childNodes){
            let cardId = childNode.dataset.cardid;
            $.ajax({
                type: 'post',
                url: '/update-card',
                data: {'card_id': cardId, 'order': newOrder, 'status_id': target.dataset.statusid},
                dataType: 'json',
                success: function () {
                    for (let card of cards) {
                        if (card.id === Number(cardId)){
                            card.order = newOrder;
                            card.status_id = target.dataset.statusid;
                        }
                        thisObject._data.cards = cards;
                        thisObject._saveData();
                        $('.loading-alert').removeClass('active');
                    }
                }
            });
            newOrder++;
        }
    },

    getCards: function(callback) {
        callback(this._data.cards);
    },

    editCard: function(cardId, cardTitle, callback) {
        $('.loading-alert').addClass('active');
        this.getCards((cards) => {
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].id === cardId) {
                    cards[i].title = cardTitle;
                    this._saveData();
                    $.ajax({
                        type: 'post',
                        url: '/edit-card',
                        data: {
                            cardId: cardId,
                            cardTitle: cardTitle,
                        },
                        dataType: 'json',
                        success: function(response) {
                            $('.loading-alert').removeClass('active');
                            showSuccessMessage(response.message);
                        }
                    });
                    callback(cards[i]);
                    break;
                }
            }
        });
    },

    deleteBoard: function(boardId, callback) {
        $('.loading-alert').addClass('active');
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
            $.ajax({
                type: 'post',
                url: '/delete-board',
                data: {
                   boardId: boardId
                },
                success: function(data) {
                    $('.loading-alert').removeClass('active');
                    showSuccessMessage(data.message);
                }
            });
            callback(board)
        });
    },
    deleteCardById: function(cardId){
        $('.loading-alert').addClass('active');
        let cards = this._data.cards;
        let len = this._data.cards.length;
        let boardId = -1;
        for (let i=0; i<len; i++) {
            if (cards[i].id === Number(cardId)){
                boardId = cards[i].board_id;
                cards.splice(i, 1);
                break;
            }
        }
        $.ajax({
            type: 'post',
            url: '/delete-card',
            data: {
               cardId: cardId
            },
            success: function(data) {
                $('.loading-alert').removeClass('active');
                showSuccessMessage(data.message);
            }
        });
        this._data.cards = cards;
        this._saveData();

    },
    getUsername: function(callback){
        callback(this._data.username)
    },
    getStarted: function(callback){
        if (this._data.boards.length === 0){
            callback(true);
            return
        }
        callback(false)
    }
};
