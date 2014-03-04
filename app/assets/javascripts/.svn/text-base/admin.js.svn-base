/**
 * Created by Kingslayer on 17.02.14.
 */

window.manageAdminPhotos = function(){
    var photos = $('#photos');

    $('#container').scroll(function() {
        addPhotoDialogs($('.miniature'));
        setEqualHeight($(".photo_block"));
        setCheckboxes($('#photos').is(':checked'));

        if ($('.pagination').length) {
            var url;
            url = $('.pagination .next_page').attr('href');
            if (url && $(window).scrollTop() > $(document).height() - $(window).height() - 50) {
                $('.pagination').text("Fetching more photos...");
                return $.getScript(url);
            }
            return $(window).scroll();
        }
    });

    $(document).ready(function() {
        setEqualHeight($(".photo_block"));
        addPhotoDialogs($('.miniature'));
        $('[name^="photo_id_"]').click(function(){
            if( photos.is(':checked')){
                photos[0].checked = false;
                setCheckboxes(photos.is(':checked'));
                $(this)[0].checked = true;
            }
        });

        $('#photos').click(function(){
            setCheckboxes($('#photos').is(':checked'));
        });
    });

    function setCheckboxes(checkState){
        var checkboxes =  $('[name^="photo_id_"]');

        for(var i = 0; i < checkboxes.length; i++){
            checkboxes[i].checked = checkState;

            $(checkboxes[i]).off().click(function(){
                if( photos.is(':checked')){
                    photos[0].checked = false;
                    setCheckboxes(photos.is(':checked'));
                    $(checkboxes[i]).checked = true;
                }
            });
        }
    }

    function setEqualHeight(columns){
        var tallestcolumn = 0;
        columns.each(
            function()
            {
                currentHeight = $(this).height();
                if(currentHeight > tallestcolumn)
                {
                    tallestcolumn = currentHeight;
                }
            }
        );
        columns.height(tallestcolumn);
    }

};

window.manageAdminUsers = function(){
    var allUsers = $('#users');
    addMessagePopup();

    $(document).ready(function() {
        $('[name^="user_id_"]').click(function(){
            if( allUsers.is(':checked')){
                allUsers[0].checked = false;
                setCheckboxes(allUsers.is(':checked'));
                $(this)[0].checked = true;
            }
        });

        allUsers.click(function(){
            setCheckboxes(allUsers.is(':checked'));
        });
    });

    $('#container').scroll(function() {
        setCheckboxes(allUsers.is(':checked'));
    });

    function setCheckboxes(checkState){
        var checkboxes =  $('[name^="user_id_"]');

        for(var i = 0; i < checkboxes.length; i++){
            checkboxes[i].checked = checkState;

            $(checkboxes[i]).off().click(function(){
                if( allUsers.is(':checked')){
                    allUsers[0].checked = false;
                    setCheckboxes(allUsers.is(':checked'));
                    $(checkboxes[i]).checked = true;
                }
            });
        }
    }

    function addMessagePopup() {
        $('.write').click(function() {
            $("#message_popup").dialog({
                width: 300,
                height: 100,
                resizable: false,
                draggable: false,
                modal: true,
                open: function(){

                    var interval = setInterval(function(){
                        if($("#message-close").length > 0){

                            $("#message-close").off().click(function(){
                                $("[title='close']").trigger('click');
                            });

                            //clearInterval(interval);
                        }
                    }, 100)

                }
            });
        });
    }

};
