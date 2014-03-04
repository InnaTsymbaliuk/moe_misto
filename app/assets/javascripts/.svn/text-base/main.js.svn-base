;
//jQuery(function ($) {
//    //region ====================== Variables ======================
//   var map, defaultCenter, zoomValue, zoomLevelOnClick, bounds, eventRectangle, layer,
//       delayTimeForRequest,headerHeight,drawingManager, overlay, buttonForChangeMode, selectedArea, popup;
//
//    zoomValue = 13;
//    zoomLevelOnClick = 2;
//    defaultCenter = new google.maps.LatLng(49.419237, 32.067692);
//    bounds = new google.maps.LatLngBounds(
//        new google.maps.LatLng(49.375149, 31.965408),
//        new google.maps.LatLng(49.504924, 32.148399)
//    );
//    eventRectangle = document.getElementById('eventRectangle');
//    buttonForChangeMode = $('#change-mode');
//    layer = $('#layer');
//    delayTimeForRequest = 250;                                      // in milliseconds
//    headerHeight = $("header").height();
//    drawingManager = new google.maps.drawing.DrawingManager({
//
//        drawingMode: google.maps.drawing.OverlayType.CIRCLE,
//        drawingControl: false,
//
//        circleOptions: {
//            fillColor: '#ffff00',
//            fillOpacity: 0.3,
//            strokeWeight: 1,
//            clickable: false,
//            editable: false,
//            zIndex: 1
//        }
//
//    });
//    popup = $('#click-on-map');
//    popup.hide();
//    // creating empty OverlayView (needed for revert pixels to google cordinates)
//    overlay = new google.maps.OverlayView();
//    overlay.draw = function() {};
//    //endregion
//    layerResize(); // calculating initial sizes of shadows and rectangle
//    bindLayerEvents(); // binding all layer events
//
//    addAutorizationPopup(); // add autorization window pop-up
//
//    google.maps.event.addDomListener(window, 'load', init); // load map
//
//    //region ====================== Function for initializing map ======================
//    function init() {
//        var map_canvas = document.getElementById('map_canvas'),
//            map_options = {
//                center: defaultCenter,
//                zoom: zoomValue,
//                zoomControl: false,
//                zoomControlOptions: {
//                    style: google.maps.ZoomControlStyle.SMALL
//                },
//                mapTypeControl: false,
//                mapTypeControlOptions: {
//                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
//                },
//                rotateControl: false,
//                panControl: false,
//                overviewMapControl: false,
//                disableDefaultUI: true,
//                mapTypeId: google.maps.MapTypeId.ROADMAP
//            };
//
//        map = new google.maps.Map(map_canvas, map_options);
//
//        // map styles
//        var styles = [
//            {
//                featureType: "all",
//                stylers: [
//                    { saturation: -80 }
//                ]
//            },{
//                featureType: "road.arterial",
//                elementType: "geometry",
//                stylers: [
//                    { hue: "#ff9900" },
//                    { saturation: 100 }
//                ]
//            },{
//                featureType: "poi.business",
//                elementType: "labels",
//                stylers: [
//                    { visibility: "off" }
//                ]
//            },{
//                "featureType": "administrative.locality",
//                "elementType": "labels",
//                "stylers": [
//                    { "hue": "#ffbb00" },
//                    { "saturation": 100 },
//                    { "visibility": "off" }
//                ]
//            }
//        ];
//
//        map.set('styles', styles);
//
//
//        overlay.setMap(map);
//        buttonForChangeMode.fadeOut();
//
//        addMapListerners();
//        checkAuthorization();
//
//    }
//    //endregion
//
//    //region ======================  Function for adding event listerners ======================
//    function addMapListerners(){
//
//        // request cord. if window resize
//        google.maps.event.addDomListener(window, 'resize', limited(delayTimeForRequest, function(){
//            getCoordinates();
//            panMapView()
//        }));
//
//        // request cord. if mouse over eventRectangle
//        google.maps.event.addDomListener(eventRectangle, 'mouseenter', limited(delayTimeForRequest, getCoordinates));
//
//        // change bounds of map after click on eventRectangle
//        google.maps.event.addDomListener(eventRectangle, 'click', function(){
//
//            var eventRectangleBounds = eventRectangle.getBoundingClientRect(),
//                cLB = 0,
//                cRT = 0;
//
//            cLB= overlay.getProjection().fromContainerPixelToLatLng(
//                new google.maps.Point(eventRectangleBounds.left, eventRectangleBounds.bottom - headerHeight)
//            );
//
//            cRT= overlay.getProjection().fromContainerPixelToLatLng(
//                new google.maps.Point(eventRectangleBounds.right, eventRectangleBounds.top - headerHeight)
//            );
//
//            var bounds = new google.maps.LatLngBounds(
//                cLB,
//                cRT
//            );
//
//            /* reset attributes*/
//            buttonForChangeMode.fadeIn();
//            if(buttonForChangeMode.hasClass('select-mode')){
//                drawingManager.setMap(map);
//            }
//            layer.removeClass('imageExist');
//            layer.fadeOut();
//            $('.layer img').remove();
//            map.fitBounds(bounds);
//        });
//
//        // change zoom and map center on mouse wheel up event on main page
//        google.maps.event.addDomListener(eventRectangle, 'mousewheel', function(){
//            var eventRectangleBounds = eventRectangle.getBoundingClientRect(),
//                cLB = 0,
//                cRT = 0;
//
//            cLB= overlay.getProjection().fromContainerPixelToLatLng(
//                new google.maps.Point(eventRectangleBounds.left, eventRectangleBounds.bottom - headerHeight)
//            );
//
//            cRT= overlay.getProjection().fromContainerPixelToLatLng(
//                new google.maps.Point(eventRectangleBounds.right, eventRectangleBounds.top - headerHeight)
//            );
//
//            var bounds = new google.maps.LatLngBounds(
//                cLB,
//                cRT
//            );
//            if(event.wheelDelta > 0){
//                /* reset attributes*/
//                buttonForChangeMode.fadeIn();
//                if(buttonForChangeMode.hasClass('select-mode')){
//                    drawingManager.setMap(map);
//                }
//                layer.removeClass('imageExist');
//                layer.fadeOut();
//                $('.layer img').remove();
//                map.fitBounds(bounds);
//            }
//        });
//
//        // if zoom value lower than default, center of the map and zoom becames default
//        // and layer becomes visible. Also removes circle selection from map
//        google.maps.event.addListener(map, 'zoom_changed', function(){
//            popup.fadeOut();
//            if(map.getZoom() < zoomValue){
//                map.setZoom(zoomValue);
//                map.setCenter(bounds.getCenter());
//                drawingManager.setMap(null);
//                if (selectedArea) {
//                    selectedArea.setMap(null);
//                    google.maps.event.clearInstanceListeners(selectedArea);
//                    selectedArea = null;
//                }
//                buttonForChangeMode.fadeOut();
//                layer.fadeIn();
//            }
//
//        });
//
//        /* Event firing when circle is complete by user. Event listerner for Drawing Manager */
//        google.maps.event.addListener(drawingManager, 'circlecomplete', function( circle ) {
//            if(circle){
//                var circleCenter, firstCirclePoint, lastCirclePoint;
//
//                circleCenter = overlay.getProjection().fromLatLngToContainerPixel(circle.getCenter());
////                firstCirclePoint =  overlay.getProjection().fromLatLngToDivPixel(circle.getBounds().getSouthWest());
////                lastCirclePoint = overlay.getProjection().fromLatLngToDivPixel(circle.getBounds().getNorthEast());
//
//                /* If user create circle more than 625 m,
//                circle will be redrawn to 625 m */
//                if(circle.getRadius() > 625){
//                    circle.setRadius(625);
//                    map.setCenter(circle.getCenter());
//                    // Show pop-up when cicrcle complete
//                    circleCenter = overlay.getProjection().fromLatLngToContainerPixel(circle.getCenter());
//                    popup.css({'top': circleCenter.y, 'left': circleCenter.x});
//                    popup.fadeIn();
//                }
////                console.log(
////                circleCoordinates.getNorthEast().lat(),
////                circleCoordinates.getNorthEast().lng(),
////                circleCoordinates.getSouthWest().lat(),
////                circleCoordinates.getSouthWest().lng()
////            )
//                // Show pop-up when cicrcle complete
//                else {
//                    popup.css({'top': circleCenter.y, 'left': circleCenter.x});
//                    popup.fadeIn();
//                }
//                selectedArea = circle;
//            }
//        });
//
//        /* Panoraming map after map fully loaded */
//        google.maps.event.addListenerOnce(map, 'idle', panMapView);
//
//        /* Show pop-up when clicking on map */
//        google.maps.event.addListener(map, 'click', function(event){
//            popup.css({'top': event.pixel.y, 'left': event.pixel.x});
//            popup.fadeIn();
//        });
//
//        // event needed for delete previous circle selection when user begin to write new one
//        $('#map_canvas').on('mousedown', function(event) {
//            if (selectedArea) {
//                selectedArea.setMap(null);
//                popup.fadeOut();
//                google.maps.event.clearInstanceListeners(selectedArea);
//                selectedArea = null;
//            }
//        });
//
//        // event for changing class of button and changing user mode
//        // from point to circle-selection
//        buttonForChangeMode.button().click(function () {
//            buttonForChangeMode.toggleClass('select-mode', 'click-mode');
//            if(buttonForChangeMode.hasClass('select-mode')){
//                drawingManager.setMap(map);
//            }
//            else if(buttonForChangeMode.hasClass('click-mode')){
//                drawingManager.setMap(null);
//            }
//        });
//    }
//    //endregion
//
//    //region ====================== Functions for shadow layer resizing ==============================
//    /* calculate shadow and rectangle */
//    function layerResize() {
//        var $left = $("#layerLeft");
//        var $right = $("#layerRight");
//        var $up = $("#layerUp");
//        var $down = $("#layerDown");
//        var $eventRectangle = $("#eventRectangle");
//
//        /* size of content div */
//        var contHeight = $("#content").height();
//        var contWidth = $("#content").width();
//
//        /* size of rectangle */
//        var rectWidth = Math.floor((contWidth - 1) / 5); // 5 positions horizontal, 1 - little margin from left and right borders;
//        var rectHeight = Math.floor((contHeight - 5) / 3); // 3 positions vertical, 5 - little margin from top and bottom borders;
//
//        /* size of left shadow */
//        $left.width((contWidth - rectWidth) / 2);
//        if ($left.width() * 2 + rectWidth > contWidth) {
//            --rectWidth;
//            $left.width((contWidth - rectWidth) / 2);
//        } //check for excluding one more pixel if panels will have not integer value.
//        $left.height((contHeight + rectHeight) / 2);
//        if ($left.height()*2 - rectHeight > contHeight) {
//            --rectHeight;
//            $left.height((contHeight + rectHeight) / 2);
//        } //check for excluding one more pixel if panels will have not integer value.
//        /* size of bottom shadow */
//        $down.height((contHeight - rectHeight) / 2);
//
//        /* size of right shadow */
//        $right.height((contHeight + rectHeight) / 2);
//        $right.width($left.width());
//
//        /* position and size of up shadow */
//        $up.height((contHeight - rectHeight) / 2);
//        $up.width(rectWidth);
//        $up.css("left", $left.width());
//
//        /* position and size of rectangle */
//        $eventRectangle.css("top", $up.height());
//        $eventRectangle.css("left", $left.width());
//        $eventRectangle.width(rectWidth);
//        $eventRectangle.height(rectHeight);
//    }
//
//    /* unbinding events from all shadows */
//    function unbindLayerEvents() {
//        $('.layer').each(function () {
//            $(this).unbind();
//        })
//        /* reset attributes*/
//        $('.layer').removeClass('imageExist');
//        $('.layer img').remove();
//        $('#layer svg').remove();
//        popup.fadeOut();
//    }
//
//    /* binding events to all shadows and rectangle(before binding the rectangle shadows are not active
//     on mouse move, we need it on load and after resize event)
//     */
//    function bindLayerEvents() {
//
//        var $eventRectangle = $("#eventRectangle");
//        var $left = $("#layerLeft");
//        var $right = $("#layerRight");
//        var $up = $("#layerUp");
//        var $down = $("#layerDown");
//
//        $eventRectangle.mouseenter(function () {
//            /* left move event */
//            $left.mouseenter(function () {
//                /* check if there is enough place to move */
//                if ($(this).width() >= $eventRectangle.width()) {
//                    /* unbind all layer events */
//                    $eventRectangle.unbind();
//                    unbindLayerEvents();
//                    //Check for existing place to set image on this side
//                    if($(this).width() < $eventRectangle.width()*2){
//                        $(this).removeClass("canDisplay"); //setting attribute
//                    }
//                    $right.addClass("canDisplay");
//                    /* recalculating position and size of elements */
//                    $(this).width($(this).width() - $eventRectangle.width());
//                    $right.width($right.width() + $eventRectangle.width());
//                    $up.css('left', $(this).width());
//                    $eventRectangle.css('left', $(this).width());
//                    /* rebind shadows events */
//                    bindLayerEvents();
//                }
//            });
//            /* right move event */
//            $right.mouseenter(function () {
//                /* check if there is enough place to move */
//                if ($(this).width() >= $eventRectangle.width()) {
//                    /* unbind all layer events */
//                    $eventRectangle.unbind();
//                    unbindLayerEvents();
//                    //Check for existing place to set image on this side
//                    if($(this).width() < $eventRectangle.width()*2){
//                        $(this).removeClass("canDisplay");  //setting attribute
//                    }
//                    $left.addClass("canDisplay");
//                    /* recalculating position and size of elements */
//                    $(this).width($(this).width() - $eventRectangle.width());
//                    $left.width($left.width() + $eventRectangle.width());
//                    $up.css('left', $left.width());
//                    $eventRectangle.css('left', $left.width());
//                    /* rebind shadows events */
//                    bindLayerEvents();
//                }
//            });
//            /* up move event */
//            $up.mouseenter(function () {
//                /* check if there is enough place to move */
//                if ($(this).height() >= $eventRectangle.height()) {
//                    /* unbind all layer events */
//                    $eventRectangle.unbind();
//                    unbindLayerEvents();
//                    //Check for existing place to set image on this side
//                    if($(this).height() < $eventRectangle.height()*2){
//                        $(this).removeClass("canDisplay");  //setting attribute
//                    }
//                    $down.addClass("canDisplay");
//                    /* recalculating position and size of elements */
//                    $(this).height($(this).height() - $eventRectangle.height());
//                    $eventRectangle.css('top', $(this).height());
//                    $right.height($(this).height() + $eventRectangle.height());
//                    $left.height($(this).height() + $eventRectangle.height());
//                    $down.height($down.height() + $eventRectangle.height());
//                    /* rebind shadows events */
//                    bindLayerEvents();
//                }
//            });
//            /* down move event */
//            $down.mouseenter(function () {
//                /* check if there is enough place to move */
//                if ($(this).height() >= $eventRectangle.height()) {
//                    /* unbind all layer events */
//                    $eventRectangle.unbind();
//                    unbindLayerEvents();
//                    //Check for existing place to set image on this side
//                    if($(this).height() < $eventRectangle.height()*2){
//                        $(this).removeClass("canDisplay");  //setting attribute
//                    }
//                    $up.addClass("canDisplay");
//                    /* recalculating position and size of elements */
//                    $(this).height($(this).height() - $eventRectangle.height());
//                    $up.height($up.height() + $eventRectangle.height());
//                    $right.height($up.height() + $eventRectangle.height());
//                    $left.height($up.height() + $eventRectangle.height());
//                    $eventRectangle.css('top', $up.height());
//                    /* rebind shadows events */
//                    bindLayerEvents();
//                }
//            });
//        });
//    }
//
//    $(window).resize(function () {
//        $("#eventRectangle").unbind();
//        unbindLayerEvents();
//        layerResize();
//        bindLayerEvents()
//        popup.fadeOut();
//    });
//
//    /* Redrawing layers when user change window size when he is not in our tab */
//    $(window).focus(function () {
//        $("#eventRectangle").unbind();
//        unbindLayerEvents();
//        layerResize();
//        bindLayerEvents()
//        popup.fadeOut();
//    });
//
//    //endregion
//
//    /**
//     * Function for panoraming map for different screens
//     */
//    function panMapView(){
//        var mapDiv, screenTop, screenBottom, screenHeight, boundsHeight;
//
//        /* Pan map to our bounds and set center of map and default zoom (13) */
//        map.panToBounds(bounds);
//        map.setCenter(bounds.getCenter());
//        zoomValue = 13;
//        map.setZoom(13);
//
//        // getting map div node and getting latitude/longitude cordinates
//        // of middle-top and middle-bottom points of the div-container
//        mapDiv = document.getElementById("map_canvas").getBoundingClientRect();
//        screenTop = overlay.getProjection().fromContainerPixelToLatLng(
//            new google.maps.Point(mapDiv.left - mapDiv.width/2, mapDiv.top)
//        );
//        screenBottom= overlay.getProjection().fromContainerPixelToLatLng(
//            new google.maps.Point(mapDiv.left - mapDiv.width/2, mapDiv.bottom)
//        );
//
//        // calculating height of map-container in metres
//        // and distance between bounds center and top point (also in metres)
//        screenHeight = google.maps.geometry.spherical.computeDistanceBetween(screenTop, screenBottom);
//        boundsHeight = google.maps.geometry.spherical.computeDistanceBetween(bounds.getCenter(), bounds.getSouthWest());
//
//        // if height of map more than distance between bounds,
//        // substract zoom number
//        if(screenHeight < boundsHeight){
//            zoomValue--;
//            map.setZoom(zoomValue);
//        }
//    }
//
//    function addMarker(location) {
//        var marker = new google.maps.Marker({
//            position: location,
//            map: map
//        });
//
//    }
//    /*  Function for converting div coordinates to google map coordinates */
//    function getCoordinates(){
//        var eventRectangleBounds = eventRectangle.getBoundingClientRect();
//
//        // coordinates left-top point
//        var coordinatesLT = overlay.getProjection().fromContainerPixelToLatLng(
//            new google.maps.Point(eventRectangleBounds.left, eventRectangleBounds.top-headerHeight)
//        );
//
//        // coordinates right-bottom point
//        var coordinatesRB = overlay.getProjection().fromContainerPixelToLatLng(
//            new google.maps.Point(eventRectangleBounds.right, eventRectangleBounds.bottom-headerHeight)
//        );
//
//        // request to server
//        $.ajax({
//            url: "/sendcoords",
//            type: "POST",
//            data: {
//                'lat1': coordinatesLT.lat().toFixed(5),
//                'lon1': coordinatesLT.lng().toFixed(5),
//                'lat2': coordinatesRB.lat().toFixed(5),
//                'lon2': coordinatesRB.lng().toFixed(5)
//            },
//            success: function (result) {
//                /* reset attributes*/
//                $('.layer').removeClass('imageExist');
//                $('.layer img').remove();
//
//                /*images loop*/
//                for (var i = 0; i < result.length; i++) {
//                    /*creating image*/
//                    var img = $('<img class="preview">');
//                    img.attr('src', result[i].image.url);
//                    $(".pixel").remove();
//                    var pixel = overlay.getProjection().fromLatLngToContainerPixel(new google.maps.LatLng(result[i].latitude, result[i].longitude));
//                    img.attr('x', pixel.x);
//                    img.attr('y', pixel.y + headerHeight);
//                    /*Adding image to one of available shadows*/
//                    var success = false;
//                    while(!success){
//                        var randomLayerNumber = Math.floor(Math.random()* ($('.canDisplay').length+1));
//                        var randomLayer = $(".canDisplay:eq("+randomLayerNumber+")");
//                        if(randomLayer.length > 0 && !randomLayer.hasClass("imageExist")){
//                            randomLayer.addClass("imageExist");
//                            randomLayer.append(img);
//                            success = true;
//                        }
//                    }
//                }
//                //Adding SVG tag to layer
//                $('#layer svg').remove();
//                var tailsContainer = $('<svg width="100%" height="100%">');
//                $('#layer').append(tailsContainer);
//                //Waiting for images to load on page
//                $(".preview").on('load', function(){
//                    //appending images to SVG container
//                    tailsContainer.append(drawTails($(this).parent(".layer"), $(this)));
//                });
//            },
//            error: function (result) {
//                console.log(arguments);
//            },
//            complete: function () {
//            }
//        });
//    }
//
//    function checkAuthorization(){
//        var userName, userPass;
//        userName = $("#user-name");
//        userPass = $("#user-pass");
//
//        $("#logIn_button").attr("disabled", "disabled");
//
//        userName.change(function(event){
//            if(new RegExp('@').test(userName.val())){
//                $('#user-name-error').html(" ");
//                $("input[type=submit]").removeAttr("disabled");
//                return;
//            }
//            else{
//                $("input[type=submit]").attr("disabled", "disabled");
//                $('#user-name-error').html("This is not an e-mail!");
//            }
//        });
//
//        userPass.change(function(event){
//            if(userPass.val().length < 6 || userPass.val().length > 20){
//                $("input[type=submit]").attr("disabled", "disabled");
//                $('#user-pass-error').html("Wrong password!");
//            }
//            else{
//                $('#user-pass-error').html(" ");
//                $("input[type=submit]").removeAttr("disabled");
//                return;
//            }
//        });
//    }
//
//    //region ====================== Visual functions ======================
//    /* Drawing tails for previews*/
//    function drawTails(container, img){
//        //creating path element
//        xmlns = "http://www.w3.org/2000/svg";
//        var tail = document.createElementNS(xmlns,"path");
//        //get position in DOM
//        var imgPosition = img.offset();
//        var rectPosition = $("#eventRectangle").offset();
//        //checking for direction of tail and calculating coordinates
//        if(container.hasClass('left')){
//            var startX = Math.round(imgPosition.left + img.width());
//            var startY = Math.round(imgPosition.top + img.height()/3);
//            startX = startX + 10;//correcting width by difference caused by image padding (5px)
//            var endX = startX;
//            var endY = startY + Math.round(img.height()/4);
//        }else if(container.hasClass('right')){
//            var startX = Math.round(imgPosition.left);
//            var startY = Math.round(imgPosition.top + img.height()/3);
//            var endX = startX;
//            var endY = startY + Math.round(img.height()/4);
//        }else if(container.hasClass('up')){
//            var startX = Math.round(imgPosition.left + img.width()/3);
//            var startY = Math.round(imgPosition.top + img.height());
//            startY = startY + 10; //correcting height by difference caused by image padding (5px)
//            var endX = startX + Math.round(img.width()/4);
//            var endY = startY;
//        }else if(container.hasClass('down')){
//            var startX = Math.round(imgPosition.left + img.width()/3);
//            var startY = Math.round(imgPosition.top);
//            var endX = startX + Math.round(img.width()/4);
//            var endY = startY;
//        }
//        var pointX = img.attr("x");
//        var pointY = img.attr("y");
//        //correcting height by difference caused by header
//        startY = startY - headerHeight;
//        pointY = pointY -headerHeight;
//        endY = endY - headerHeight;
//
//        //creating path direction
//        var path = "M" + startX + " " + startY + " L" + pointX + " " + pointY + " L" + endX + " " + endY + " Z";
//        tail.setAttributeNS(null, "d", path);
//        return tail;
//    }
//    //endregion
//
//    //region ====================== Decorators ======================
//    /* This function makes delay in milliseconds and than
//    does the function(second argument) with saved "this" and "arguments"  */
//    function limited(time, func){
//        var args, whoIsThis;
//        var isCalled = false;
//        if(typeof time === "function"){
//            func = time;
//            time = 20;
//        }
//
//        return function(){
//            whoIsThis = this;
//            args = arguments;
//            if(isCalled == false){
//                isCalled = true;
//                setTimeout(function(){
//                    func.apply(whoIsThis, args);
//                    isCalled = false;
//                }, time);
//            }
//        };
//    }
//    //endregion
//
//    // for registration dropdown-menu
//    function addAutorizationPopup(){
//        $('#topAuthors').click(function () {
//            $("#dialog").dialog({
//                width: 400,
//                height: 300,
//                resizable: false,
//                draggable: false
//            });
//        });
//        $('#authorization').click(function () {
//            $("#authorization-menu").dialog({
//                width: 265,
//                height: 360,
//                resizable: false,
//                draggable: false
//            });
//        });
//
//    };
//
//
//});
