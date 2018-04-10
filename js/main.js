$("#login").submit(function (event) {
    event.preventDefault();
    var email = $("#username").val(),
        password = $("#password").val(),
        url = "http://ec2-52-91-175-30.compute-1.amazonaws.com/api/userLogin";
    axios.post(url, {
        email: email,
        password: password
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
        })
        .then(function (response) {
            sessionStorage['token'] = response.data.success.api_token;
            sessionStorage['ucid'] = response.data.success.ucid;
            sessionStorage['job_title'] = response.data.success.job_title;
            console.log(sessionStorage['token']);
            console.log(response);
            console.log(sessionStorage['job_title']);
            /*if(sessionStorage['job_title'] === "admin") {
                window.location.replace("adminplus.html");
            } else {*/
            window.location.replace("/newissue");
            //}
        })
        .catch(function (error) {
            if (error.response.status === 401) {
                $("#login-failure").show();
            }
        });
});

$("#iss_creation").submit(function (event) {
    event.preventDefault();
    var c_ucid = $("#cust_ucid").val(),
        building = $("#building").val(),
        room = $("#room").val(),
        iss_descr = $("#iss_desc").val(),
        iss_type = $("#iss_type").val(),
        tech = $("#tech").val(),
        loggedin = sessionStorage['ucid'],
        url = "http://ec2-52-91-175-30.compute-1.amazonaws.com/api/addIssue";

    axios.post(url, {
        iss_type: iss_type[0],
        building_id: building[0],
        room_num: room,
        cust_ucid: c_ucid,
        iss_description: iss_descr,
        front_desk_tech: loggedin,
        tech_ucid: tech[0],
        status: "open"
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage['token'],
        }
        })
        .then(function (response) {
            document.getElementById("iss_creation").reset();
            $("#form-success").show();
            $("html, body").animate({ scrollTop: 0 }, "slow");
            setTimeout(function () { $("#form-success").hide(); }, 8000);
        })
        .catch(function (error) {
            $("#form-failure").show();
            $("html, body").animate({ scrollTop: 0 }, "slow");
            setTimeout(function () { $("#form-failure").hide(); }, 8000);

        });
});

$("#logout").click(function (event) {
    event.preventDefault();
    // Clear session variables
    sessionStorage.clear();
    window.location.replace("/");
});

function getIssues() {
    url = "http://ec2-52-91-175-30.compute-1.amazonaws.com/api/Issue";

    axios.get(url, {
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage['token'],
        }
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
        });
}

function auth() {
    if (!sessionStorage['token']) {
        sessionStorage.clear();
        window.location.replace("/");
    } else {
        //loadTechs();
    }

}

function loadTechs() {
    // Load techs here
}
