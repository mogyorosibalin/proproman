function loadEventListeners() {
    // Here comes the login and register form submitting with ajax.
    $('#registerForm').on('submit', function(event) {
        let $this = $(this);
        event.preventDefault();
        $.ajax({
            type: 'post',
            url: '/register',
            data: {
                username: $(this).find('input[name=username]').val(),
                password: $(this).find('input[name=password]').val(),
                passwordAgain: $(this).find('input[name=passwordAgain]').val()
            },
            dataType: 'json',
            success: function(data) {
                $this.find('input[type=password]').val("");
                let messagesString = "";
                for (let row of data.messages) {
                    messagesString += `<div class="${row.type}">${row.message}</div>`;
                }
                $this.find('.messages').html(messagesString);
            }
        });
    });
}

$(document).ready(function() {
    loadEventListeners();
});