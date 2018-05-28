function loadEventListeners() {
    // Here comes the login and register form submitting with ajax.
    document.getElementById('login').addEventListener('click', login, false);

}

function login (e) {
    e.preventDefault();
    let username = e.target.form[0].value;
    let password = e.target.form[1].value;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/login');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert(xhr.response);
        }
        else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(encodeURI('username='+username+'&password='+password))

}

window.onload = function() {
    loadEventListeners();
};