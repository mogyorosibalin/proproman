function loadEventListeners() {
    // Here comes the login and register form submitting with ajax.
    $('#registerForm').on('submit', function(event) {
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
                // console.log(data);
            }
        });
    });
}

$(document).ready(function() {
    loadEventListeners();
});