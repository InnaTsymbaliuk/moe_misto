// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
window.manageUsersPage = function(){

    $(document).ready(function(){
        addPhotoDialogs($('.miniature'));
    });

    $(".uploaded_photo, .confirmed_photo").click(function(){
        var thisLi = $(this);
        var interval = setInterval(function(){
            if(thisLi.hasClass('active')){
                addPhotoDialogs($('.miniature'));
                clearInterval(interval);
            }
        }, 200);
    });

    $(".edit_profile, .edit").click(function(){
        var editButton = $('.edit_profile');
        var interval = setInterval(function(){
            if(editButton.hasClass('active')){

                $('#user_birth_date').datepicker({
                    dateFormat: 'dd-mm-yy',
                    changeMonth: true,
                    changeYear: true,
                    maxDate: "-4y",
                    yearRange : '1900:c',
                    monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
                    monthNamesShort:[ "Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Ноябрь", "Дек" ]
                });

                $('#user_avatar').change(function(){
                    var file = $(this).prop('files')[0];
                    if(file.type.match(/jpg|jpeg|png|bmp/)){
                        if(file.size < 5000000 && file.size > 10000){
                            return true;
                        }else{
                            $(this).prop({files: [], value: ''});
                            return alert('Размер файла должен быть от 10 кб до 5 мб')
                        }
                    }else {
                        $(this).prop({files: [], value: ''});
                        return alert('Файл должен быть одного из следующих форматов: jpg,jpeg,png,bmp ')
                    }
                });
                validateFields();
                clearInterval(interval);
            }
        }, 200);
    });


    function validateFields(){
        return  $(".edit_user").validate({
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
                }
            }, meseges: {
                "user_nick": 'From 8 to 64 characters',
                "user_first_name": 'From 4 to 64 characters',
                "user_last_name": 'From 4 to 64 characters',
                "user_birth_date": 'Your birth date',
                "user_email":'From 4 to 64 characters'
            },
            errorPlacement: function (error, element) {
                $('.btn').attr('disabled', 'disabled')
            }
        });

    }
};

