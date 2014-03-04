// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.ui.all
//= require jquery_ujs
//= require jquery-fileupload/basic
//= require jquery.validate
//= require jquery.validate.additional-methods
//= require toastmessage/jquery.toastmessage
//= require_tree .


;
jQuery(function ($) {

    addTopAuthorPopup();
    addAuthorizationPopup();                                 // add authorization window pop-up
    checkAuthorization();

    function checkAuthorization() {

        var form = $("#new_user").validate({
            rules: {
                "user-name": {
                    required: true,
                    minlength: 8,
                    maxlength: 30,
                    email:true
                },
                "user-pass": {
                    required: true,
                    minlength: 4,
                    maxlength: 30
                }
            },meseges:{

            },
            errorPlacement: function(error, element) {
                if(element.prop("name") == "user-name") {
                    error.appendTo("#user-name-error");
                }

                else if(element.prop("name") == "user-pass") {
                    error.appendTo("#user-pass-error");
                }
            }
        });



    }

    function addTopAuthorPopup() {
        $('#topAuthors').click(function () {
            $("#top_authors").dialog({
                width: 850,
                height: 500,
                resizable: false,
                draggable: false,
                modal: true,
                open: allUserPhotoInTop
            });
        });


    }

    // for registration dropdown-menu
    function addAuthorizationPopup() {
        $('#authorization').click(function () {
            $("#authorization-menu").dialog({
                width: 265,
                height: 360,
                resizable: false,
                draggable: false,
                modal: true
            });
        });

    }

    // function addMessagePopUp(){
    //     $('.write').click(function(){
    //         var interval = setInterval(function(){
    //             if($('#message_popup').find('form').length == 0){
    //                 return;
    //             }
    //             $('#message_popup').dialog({
    //                 width: 400,
    //                 height: 300,
    //                 resizable: false,
    //                 draggable: false,
    //                 close: function(){
    //                     $(this).remove();
    //                 },
    //                 title: "Message"
    //             });
    //             clearInterval(interval);
    //         },10);
    //     });
    // }

    function allUserPhotoInTop(){
        var interval = setInterval(function(){
            if($('.top a').length == 0){
                return;
            }
            $.each($('.top').find('a[href="#"]'), function(index, node){
                getUserPhotos($(node), 'id', function(){
                    $('.user-photos').show();
                    $('#top_authors').dialog('close');
                    $('#userPhotosClose').click(function(){
                        $('.user-photo').remove();
                        $('.user-photos').hide();
                    });
                    addPhotoDialogs($('.user-photo'));
                });
            });
            // addMessagePopUp();
            clearInterval(interval);
        }, 200);
    }

});

