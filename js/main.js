

$("#login").submit(function(event) {
    event.preventDefault();
    var email = $("#username").val(),
        password = $("#password").val(),
        url = "http://ec2-52-91-175-30.compute-1.amazonaws.com/api/userLogin";
    axios.post(url, {
        email: email,
        password: password
    }, {headers: {
        'Content-Type': 'application/json',
    }})
        .then(function(response) {
            sessionStorage['token'] = response.data.token;
            console.log(sessionStorage['token']);
            console.log(response);
        });
});




