// This function is to initialize the application
function init() {
    // init data
    dataHandler.init();
    // loads the boards to the screen
    dom.loadBoards();

}

init();

for (let dragulaEvent of dom.dragulaEvents){
    dragulaEvent.on('drop', (element, target) => {
        dataHandler.updateCardStatusOrder(target);
    });
}
