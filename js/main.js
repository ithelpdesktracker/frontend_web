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
            if (sessionStorage['job_title'] === "admin" | sessionStorage['job_title'] === "staff") {
                window.location.replace("/admin/dashboard");
            } else {
                window.location.replace("/u/newissue");
            }
        })
        .catch(function (error) {
            if (error.response.status === 401) {
                $("#login-failure").show();
            }
        });
});

$("#iss_creation").click(function (event) {
    event.preventDefault();
    var c_ucid = $("#cust_ucid").val(),
        building = $("#building").val(),
        room = $("#room").val(),
        iss_descr = $("#iss_desc").val(),
        iss_type = $("#iss_type").val(),
        tech = $("#tech").val(),
        loggedin = sessionStorage['ucid'],
        url = "http://ec2-52-91-175-30.compute-1.amazonaws.com/api/addIssue";
    console.log(c_ucid);
    console.log(building);
    console.log(room);
    console.log(iss_descr);
    console.log(tech);
    console.log(iss_type);
    axios.post(url, {
            iss_type: iss_type,
            building_id: building,
            room_num: room,
            cust_ucid: c_ucid,
            iss_description: iss_descr,
            front_desk_tech: loggedin,
            tech_ucid: tech,
            status: "unresolved"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage['token'],
            }
        })
        .then(function (response) {
            document.getElementById("iss_creation").reset();
            $("#form-success").show();
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
            setTimeout(function () {
                $("#form-success").hide();
            }, 8000);
        })
        .catch(function (error) {
            $("#form-failure").show();
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
            setTimeout(function () {
                $("#form-failure").hide();
            }, 8000);

        });
});

$("#logout").click(function (event) {
    event.preventDefault();
    // Clear session variables
    sessionStorage.clear();
    window.location.replace("/");
});

$("#new_user").click(function (event) {
    event.preventDefault();
    var ucid = $('.ucid_c').val(),
        name = $('.fname_c').val() + " " + $('.lname_c').val(),
        email = $('.email_c').val(),
        job_title = $('.usertype_c').val(),
        password = $('.password_c').val(),
        c_password = $('.c_password_c').val(),
        url = "http://ec2-52-91-175-30.compute-1.amazonaws.com/api/userRegister";
    axios.post(url, {
            ucid: ucid,
            name: name,
            email: email,
            password: password,
            c_password: c_password,
            job_title: job_title
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            console.log('User Created');
            $("#register-success").show();
            setTimeout(function () {
                $("#register-success").hide();
            }, 8000);
        })
        .catch(function (error) {
            console.log("Error");
            $("#register-failure").show();
            setTimeout(function () {
                $("#register-failure").hide();
            }, 8000);
        });
});

function getIssues() {
    url = "http://ec2-52-91-175-30.compute-1.amazonaws.com/api/Issue";

    axios.get(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage['token'],
            }
        })
        .then(function (response) {
            $('#table').bootstrapTable({
                data: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
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