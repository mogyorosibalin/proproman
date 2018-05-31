function loadEventListeners() {
    // Here comes the login and register form submitting with ajax.

    $('#registerForm').on('submit', function(event) {
        let $this = $(this);
        event.preventDefault();
        $.ajax({
            type: 'post',
            url: '/register',
            data: {
                username: $(this).find('input[name=registerUsername]').val(),
                email: $(this).find('input[name=registerEmail]').val(),
                password: $(this).find('input[name=registerPassword]').val(),
                passwordAgain: $(this).find('input[name=registerPasswordAgain]').val()
            },
            dataType: 'json',
            success: function(data) {
                $this.find('input[type=password]').val("");
                let messagesString = "";
                for (let row of data.messages) {
                    messagesString += `<div class="${row.type}">${row.message}</div>`;
                }
                $this.find('.messages').html(messagesString);

                if(data.messages[0].type === 'success'){

                    let message = 'Welcome to ProMan! <br />'+
                    'Please follow this link to activate your account: <br />' +
                    'http://127.0.0.1:5000/activate?username=' + data.messages[0].username + '&code=' + data.messages[0].activationCode +
                    '<br /> asdasdasd';

                     Email.send("promanlogin@gmail.com",
                        data.messages[0].email,
                        "Verify registration",
                        message,
                        "smtp.gmail.com",
                        "promanlogin",
                        "ProProman");
                }
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

function logout() {
    localStorage.clear();
    window.location.replace("logout");
}

window.onload = function() {
    loadEventListeners();
};