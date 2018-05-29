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

    $('#loginForm').on('submit', function(event) {
        let $this = $(this);
        event.preventDefault();
        $.ajax({
            type: 'post',
            url: '/login',
            data: {
                username: $(this).find('input[name=username]').val(),
                password: $(this).find('input[name=password]').val(),
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
                $this.find('input[type=password]').val("");
                if (data.login === 'login_success'){
                    location.reload();
                }
                else {
                    let messagesString = `<div class="${data.type}">${data.message}</div>`;
                    $this.find('.messages').html(messagesString);
                }
            }
        });
    });
}

window.onload = function() {
    loadEventListeners();
};