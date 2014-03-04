
window.manageRegistration = function(){

    var form = $("#reg_new_user").validate({
        rules: {
            "user_nick": {
                required: true,
                minlength: 8,
                maxlength: 64
            },
            "user_first_name": {
                required: true,
                minlength: 4,
                maxlength: 64
            },
            "user_last_name": {
                required: true,
                minlength: 4,
                maxlength: 64
            },
            "user_birth_date": {
                required: true
            },
            "user_gender_male": {

            },
            "user_gender_female": {

            },
            "user_email": {
                required: true,
                minlength: 4,
                maxlength: 64,
                email:true
            },
            "user_password": {
                required: true,
                minlength: 4,
                maxlength: 64
            },
            "user_password_confirmation": {
                required: true,
                minlength: 4,
                maxlength: 64
            }

        }, meseges: {

        },
        errorPlacement: function (error, element) {

            if (element.prop("name") == "user_nick") {
                error.appendTo("#login-error");
            }

            else if (element.prop("name") == "user_first_name") {
                error.appendTo("#name-error");
            }

            else if (element.prop("name") == "user_last_name") {
                error.appendTo("#surname-error");
            }

            else if (element.prop("name") == "user_birth_date") {
                error.appendTo("#date-error");
            }

            else if (element.prop("name") == "user_email") {
                error.appendTo("#e-mail-error");
            }

            else if (element.prop("name") == "user_password") {
                error.appendTo("#password-error");
            }

            else if (element.prop("name") == "user_password_confirmation") {
                error.appendTo("#password-repeat-error");
            }
        }
    });

    $('#user_birth_date').datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        maxDate: "-5y",
        yearRange : '1900:c',
        monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
        monthNamesShort:[ "Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Ноябрь", "Дек" ]
    });


    Recaptcha.create("6Lc-Ke8SAAAAAGrU8R1Yq3zkLH8TW6qf7G3WHYas",
        "captcha",
        {
            theme: "red",
            lang: "ru",
            callback: Recaptcha.focus_response_field
        }
    );

//    var isCorrect = [false, false, false, false, false, false];
//
//    $("#registrate_button").attr("disabled", "disabled");
//
//    $('.new_user').on('change', function () {
//        console.log(isCorrect)
//        for (var i = 0; i <= isCorrect.length; i++) {
//            if (i === isCorrect.length) {
//                $("input[type=submit]").removeAttr("disabled");
//                break;
//            }
//            if (isCorrect[i] === false) {
//                break;
//            }
//        }
//    });
//
//
//    var userLogin = $("#user_nick"),
//        userEmail = $("#user_email"),
//        userName = $("#user_first_name"),
//        userLastname = $("#user_last_name"),
//        userBirthdate = $("#user_birth_date"),
//        userGender = $("#user_gender"),
//        userPassword = $("#user_password"),
//        userPasswordConfirm = $("#user_password_confirmation");
//
//
//    userLogin.attr("maxlength", "64");
//    userEmail.attr("maxlength", "64");
//    userName.attr("maxlength", "64");
//    userLastname.attr("maxlength", "64");
//    userPassword.attr("maxlength", "64");
//    userPasswordConfirm.attr("maxlength", "64");
//
//
//    userEmail.change(function (event) {
//        if (userEmail.val().match(/^\w+(['\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)) {
//            userEmail.removeClass("error");
//            isCorrect[0] = true;
//        }
//        else {
//            userEmail.addClass("error");
//            userEmail.val("Incorrect email!");
//            isCorrect[0] = false;
//        }
//
//    });
//
//
//    userName.change(function (event) {
//        if (userName.val().match(/^[a-zA-Z]*$/)) {
//            userName.removeClass("error");
//            isCorrect[1] = true;
//        }
//        else {
//            userName.addClass("error");
//            userName.val("Incorrect name!");
//            isCorrect[1] = false;
//        }
//
//    });
//
//    userLastname.change(function (event) {
//        if (userLastname.val().match(/^[a-zA-Z]*$/)) {
//            isCorrect[2] = true;
//            userLastname.removeClass("error");
//        }
//        else {
//            userLastname.addClass("error");
//            userLastname.val("Incorrect last name!");
//            isCorrect[2] = false;
//        }
//    });
//
//
//    userBirthdate.change(function (event) {
//        var inputDate = userBirthdate.val().split('-'),
//            yy = parseInt(inputDate[0]),
//            mm = parseInt(inputDate[1]),
//            dd = parseInt(inputDate[2]),
//
//            todayDate = new Date(),
//            nowDay = todayDate.getDate(),
//            nowMonth = todayDate.getMonth() + 1,
//            nowYear = todayDate.getFullYear();
//
//        if (yy < nowYear - 5 && yy > nowYear - 120) {
//            userBirthdate.removeClass("error");
//            isCorrect[3] = true;
//        } else if (typeof yy === NaN || yy == nowYear) {
//            userBirthdate.addClass("error");
//            isCorrect[3] = false;
//        }
//
//        else {
//            userBirthdate.addClass("error");
//            isCorrect[3] = false;
//        }
//    });
//
//
//    userPassword.change(function (event) {
//        if (userPassword.val().length > 6) {
//            isCorrect[4] = true;
//            userPassword.removeClass("error");
//        }
//        else {
//            userPassword.addClass("error");
//            isCorrect[4] = false;
//        }
//    });
//
//    userPasswordConfirm.change(function (event) {
//        if (userPasswordConfirm.val() == userPassword.val()) {
//            userPasswordConfirm.removeClass("error");
//            isCorrect[5] = true;
//        }
//        else {
//            userPasswordConfirm.addClass("error");
//            isCorrect[5] = false;
//        }
//    });
};