function showSuccessMessage(message) {
    $('.clone').remove();
    let $clone = $('.success-message').clone().addClass('clone');
    $('body').append($clone);
    $clone.show().addClass('active').find('.message').html(message);
    setTimeout(function() {
        $clone.removeClass('active');
    }, 3000);
}

// This function is to initialize the application
function init() {
    // init data
    dataHandler.init(function() {
        dom.loadBoards();
    });
    // loads the boards to the screen


}

init();

for (let dragulaEvent of dom.dragulaEvents){
    dragulaEvent.on('drop', (element, target) => {
        dataHandler.updateCardStatusOrder(target);
    });
}
