;
jQuery(function ($) {
    //region ====================== Variables ======================
    var map,
        defaultCenter =  new google.maps.LatLng(49.419237, 32.067692),
        zoomValue = 13,
        bounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(49.375149, 31.965408),
                    new google.maps.LatLng(49.504924, 32.148399)
                    ),
        eventRectangle = document.getElementById('eventRectangle'),
        layer = $('#layer'),
        delayTimeForRequest = 250,  // in milliseconds
        headerHeight = $("header").height(),
        popup = $('#click-on-map'),
        drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.CIRCLE,
                drawingControl: false,
                circleOptions: {
                    fillColor: '#FF0000',
                    fillOpacity: 0.3,
                    strokeWeight: 1,
                    clickable: false,
                    editable: false,
                    zIndex: 1
                }
            }),
        markers = [],
        userPhotos = $('.user-photos'),
        currentLanguage = (function(){
            if(document.URL.toString().match(/uk|en|ru/) == null) return 'uk';
            return document.URL.toString().match(/uk|en|ru/)[0];
        })(),
        selectedArea,
        overlay,
        placesService;

    window.buttonForChangeMode = $('#change-mode');
    window.globalInit = init;
    window.popUpHider = showPopUp();                        // function for hiding/showing pop-ups (required string with pop-up name)
    window.sendPhotoId = sendPhotoId;
    window.getUserPhotos = getUserPhotos;
    window.setDefaultMapView = setDefaultMapView;           // if need set default map view like when you load page
    window.mapBlocked = mapBlocker();                       // true or false, if empty return map state (is/is not blocked)
    window.showPhoto = showPhoto;
    window.addPhotoDialogs = addPhotoDialogs;
    window.setTimelineOpen = function(boolean){
        if(boolean){
            return $('.photos').addClass('active');
        }
        return $('.photos').removeClass('active');
    };
    window.hideButtonForChangeMode = function (boolean){    // function for hiding/showing button for change circle/click mode
        if(boolean){
            return buttonForChangeMode.hide();
        }
        return buttonForChangeMode.show();
    };

    //endregion

    popUpHider('layer');
    hideButtonForChangeMode(true);

    google.maps.event.addDomListener(window, 'load', init); // load map

    //region ====================== Functions For Main Map ======================
    function init() {
        var map_canvas = document.getElementById('map_canvas'),
            map_options = {
                center: defaultCenter,
                zoom: zoomValue,
                zoomControl: false,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL
                },
                disableDoubleClickZoom: true,
                mapTypeControl: false,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                rotateControl: false,
                panControl: false,
                overviewMapControl: false,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

        map = new google.maps.Map(map_canvas, map_options);

        // map style
        var styles = [
            {
                featureType: "all",
                stylers: [
                    { saturation: -80 }
                ]
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                    { hue: "#ff9900" },
                    { saturation: 100 }
                ]
            },
            {
                featureType: "poi.business",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels",
                "stylers": [
                    { "hue": "#ffbb00" },
                    { "saturation": 100 },
                    { "visibility": "off" }
                ]
            }
        ];

        map.set('styles', styles);

        // creating empty OverlayView (needed for revert pixels to google cordinates)
        overlay = new google.maps.OverlayView();

        overlay.draw = function () {
        };
        overlay.setMap(map);
        placesService = new google.maps.places.PlacesService(map);

        bindLayerEvents();                                      // binding all layer events
        layerResize();                                          // calculating initial sizes of shadows and rectangle
        addMapListerners();
    }

    /**
     * Function for panoraming map for different screens
     */
    function panMapView() {
        var mapDiv, screenTop, screenBottom, screenHeight, boundsHeight;

        /* Pan map to our bounds and set center of map and default zoom (13) */
        map.panToBounds(bounds);
        map.setCenter(bounds.getCenter());
        zoomValue = 13;
        map.setZoom(13);

        // getting map div node and getting latitude/longitude cordinates
        // of middle-top and middle-bottom points of the div-container
        mapDiv = document.getElementById("map_canvas").getBoundingClientRect();
        screenTop = overlay.getProjection().fromContainerPixelToLatLng(
            new google.maps.Point(mapDiv.left - mapDiv.width / 2, mapDiv.top)
        );
        screenBottom = overlay.getProjection().fromContainerPixelToLatLng(
            new google.maps.Point(mapDiv.left - mapDiv.width / 2, mapDiv.bottom)
        );

        // calculating height of map-container in metres
        // and distance between bounds center and top point (also in metres)
        screenHeight = google.maps.geometry.spherical.computeDistanceBetween(screenTop, screenBottom);
        boundsHeight = google.maps.geometry.spherical.computeDistanceBetween(bounds.getCenter(), bounds.getSouthWest());

        // if height of map more than distance between bounds,
        // substract zoom number
        if (screenHeight < boundsHeight) {
            zoomValue--;
            map.setZoom(zoomValue);
        }
    }

    function mapBlocker(){
        var isBlocked = false;
        return function(boolean){
            switch(boolean){
                default :
                    return isBlocked;
                case true:
                    isBlocked = false;
                    return map.setOptions({draggable: false});
                case false:
                    isBlocked = true;
                    return map.setOptions({draggable: true});
            }
        };
    }

    //endregion

    //region ======================  Function for Adding Event Listerners ======================
    function addMapListerners() {

        google.maps.event.addListener(map, 'tilesloaded', function(event){
            getCoordinates();
        });

        google.maps.event.addListener(map, 'bounds_changed', limited(400, function(event){
            if(layer.css('display') === 'none'){
                return addPlaces(map.getBounds());
            }
            return removeMarkers();
        }));

        // request cord. if window resize
        google.maps.event.addDomListener(window, 'resize', limited(delayTimeForRequest, function () {
            getCoordinates();
            panMapView();
        }));

        // request cord. if mouse over eventRectangle
        google.maps.event.addDomListener(eventRectangle, 'mouseenter', limited(delayTimeForRequest, getCoordinates));

        // change bounds of map after click on eventRectangle
        google.maps.event.addDomListener(eventRectangle, 'click', function () {

            var eventRectangleBounds = eventRectangle.getBoundingClientRect(),
                cLB = 0,
                cRT = 0;

            cLB = overlay.getProjection().fromContainerPixelToLatLng(
                new google.maps.Point(eventRectangleBounds.left, eventRectangleBounds.bottom - headerHeight)
            );

            cRT = overlay.getProjection().fromContainerPixelToLatLng(
                new google.maps.Point(eventRectangleBounds.right, eventRectangleBounds.top - headerHeight)
            );

            var bounds = new google.maps.LatLngBounds(
                cLB,
                cRT
            );

            /* reset attributes*/
            hideButtonForChangeMode(false);
            if (buttonForChangeMode.hasClass('select-mode')) {
                drawingManager.setMap(map);
            }
            layer.removeClass('imageExist');
            popUpHider('all');
            $('.layer img').remove();
            map.fitBounds(bounds);
        });

        // change zoom and map center on mouse wheel up event on main page
        google.maps.event.addDomListener(eventRectangle, 'mousewheel', function () {
            var eventRectangleBounds = eventRectangle.getBoundingClientRect(),
                cLB = 0,
                cRT = 0;

            cLB = overlay.getProjection().fromContainerPixelToLatLng(
                new google.maps.Point(eventRectangleBounds.left, eventRectangleBounds.bottom - headerHeight)
            );

            cRT = overlay.getProjection().fromContainerPixelToLatLng(
                new google.maps.Point(eventRectangleBounds.right, eventRectangleBounds.top - headerHeight)
            );

            var bounds = new google.maps.LatLngBounds(
                cLB,
                cRT
            );
            if (event.wheelDelta > 0) {
                /* reset attributes*/
                hideButtonForChangeMode(false);
                if (buttonForChangeMode.hasClass('select-mode')) {
                    drawingManager.setMap(map);
                }
                layer.removeClass('imageExist');
                popUpHider('all');
                $('.layer img').remove();
                map.fitBounds(bounds);
            }
        });

        google.maps.event.addListener(map, 'dragend', function(event){
            var windowSize = document.body.getBoundingClientRect(),
                topPoint = overlay.getProjection().fromContainerPixelToLatLng(
                    new google.maps.Point(windowSize.left, windowSize.top)
                ),
                returnToCenter = function(){
                    map.setCenter(bounds.getCenter());

                    if (selectedArea) {
                        selectedArea.setMap(null);
                        selectedArea = null;
                    }
                    popUpHider('all');
                };

            if(topPoint.lat() > 49.51 || topPoint.lat() < 49.41){
                returnToCenter();
            }

            if(topPoint.lng() > 32.12 || topPoint.lng() < 31.77){
                returnToCenter();
            }

        });

        google.maps.event.addListener(map, 'dragstart', function(event){
            popUpHider('all');
        });

        // if zoom value lower than default, center of the map and zoom becames default
        // and layer becomes visible. Also removes circle selection from map
        google.maps.event.addListener(map, 'zoom_changed', function () {
            if (map.getZoom() < zoomValue || layer.css("display") == 'none' && map.getZoom() == zoomValue) {
                popUpHider('layer');
                map.setZoom(zoomValue);
                map.setCenter(bounds.getCenter());
                drawingManager.setMap(null);
                if (selectedArea) {
                    selectedArea.setMap(null);
                    google.maps.event.clearInstanceListeners(selectedArea);
                    selectedArea = null;
                }
                removeMarkers();
                hideButtonForChangeMode(true);
            }else{
                if (selectedArea) {
                    selectedArea.setMap(null);
                    selectedArea = null;
                }
                if(layer.css("display") == 'none'){
                    popUpHider('all');
                }
            }
        });

        /* Event firing when circle is complete by user. Event listerner for Drawing Manager */
        google.maps.event.addListener(drawingManager, 'circlecomplete', function (circle) {

            if (! circle) {
                return;
            }

            var popUpWithCircle = function(){
                var circleCenter = overlay.getProjection().fromLatLngToContainerPixel(circle.getCenter()),
                    request;

                getPlaceName(circle.getCenter(), (circle.getRadius()*0.001).toFixed(6));

                // Show pop-up when cicrcle complete
                mapClickPlaceSelector(circleCenter.x, circleCenter.y);
                popUpHider('popup');

                request = {
                    location: circle.getCenter(),
                    radius: circle.getRadius(),
                    rankBy: google.maps.places.RankBy.PROMINENCE
                };

                placesService.search(request, function (results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        $('#place-name').html("Біля " + results[0].name);
                        $('#location_name').val(results[0].name);
                    }
                });
                google.maps.event.trigger(map, 'dragend');
            };

            /* If user create circle more than 625 m,
             or less than 40 m circle will be redrawn */
            if (circle.getRadius() > 625) {
               circle.setRadius(625);
               map.setCenter(circle.getCenter());
               popUpWithCircle();

            } else if(circle.getRadius() < 40){
                circle.setRadius(40);
                popUpWithCircle();

            } else {// Show pop-up when circle complete
                popUpWithCircle();
            }
            selectedArea = circle;
        });

        /* Panoraming map after map fully loaded */
        google.maps.event.addListenerOnce(map, 'idle', function(){
                panMapView();
        });

        /* Show pop-up when clicking on map */
        google.maps.event.addListener(map, 'click', function (event) {

            if(mapBlocked() == false){
                return;
            }

            var mouseCoordinates = overlay.getProjection().fromContainerPixelToLatLng(
                 new google.maps.Point(event.pixel.x, event.pixel.y)
            );

            mapClickPlaceSelector(event.pixel.x, event.pixel.y);
            popUpHider('popup');

            getPlaceName(mouseCoordinates, 0.5);
        });

        // event needed for delete previous circle selection when user begin to write new one
        $('#map_canvas').on('mousedown', function (event) {
            if (selectedArea) {
                popUpHider('all');
                selectedArea.setMap(null);
                google.maps.event.clearInstanceListeners(selectedArea);
                selectedArea = null;
            }
        });

        $('.show').click(function(){
            setTimelineOpen(true);
        });

        // event for changing class of button and changing user mode
        // from point to circle-selection
        buttonForChangeMode.button().click(function () {
            buttonForChangeMode.toggleClass('select-mode', 'click-mode');
            if (buttonForChangeMode.hasClass('select-mode')) {
                drawingManager.setMap(map);
            }
            else if (buttonForChangeMode.hasClass('click-mode')) {
                drawingManager.setMap(null);
            }
        });
    }
    //endregion

    //region ====================== Functions for shadow layer resizing ==============================
    /* calculate shadow and rectangle */
    function layerResize() {
        var $left = $("#layerLeft");
        var $right = $("#layerRight");
        var $up = $("#layerUp");
        var $down = $("#layerDown");
        var $eventRectangle = $("#eventRectangle");
        var magicNumber = 2; // number of pixels to make small borders between sides of map and rectangle

        /* size of content div */
        var contHeight = $("#map_canvas").height();
        var contWidth = $("#map_canvas").width();

        /* size of rectangle */
        var rectWidth = Math.floor((contWidth - magicNumber) / 5); // 5 positions horizontal, 1 - little margin from left and right borders;
        var rectHeight = Math.floor((contHeight - magicNumber) / 3); // 3 positions vertical, 5 - little margin from top and bottom borders;

        /* size of left shadow */
        if((contWidth - rectWidth)&1){
            ++rectWidth;
        }
        $left.width(Math.floor((contWidth - rectWidth) / 2));
        if((contHeight - rectHeight)&1){
            ++rectHeight;
        }
        $left.height(Math.floor((contHeight + rectHeight) / 2));

        /* size of bottom shadow */
        $down.height((contHeight - rectHeight) / 2);

        /* size of right shadow */
        $right.height((contHeight + rectHeight) / 2);
        $right.width($left.width());

        /* position and size of up shadow */
        $up.height((contHeight - rectHeight) / 2);
        $up.width(rectWidth);
        $up.css("left", $left.width());

        /* position and size of rectangle */
        $eventRectangle.css("top", $up.height());
        $eventRectangle.css("left", $left.width());
        $eventRectangle.width(rectWidth);
        $eventRectangle.height(rectHeight);
    }

    /* unbinding events from all shadows */
    function unbindLayerEvents() {
        $('.layer').each(function () {
            $(this).unbind();
        })
        /* reset attributes*/
        $('.layer').removeClass('imageExist');
        $('.layer img').remove();
        $('#layer svg').remove();
    }

    /* binding events to all shadows and rectangle(before binding the rectangle shadows are not active
     on mouse move, we need it on load and after resize event)
     */
    function bindLayerEvents() {

        var $eventRectangle = $("#eventRectangle");
        var $left = $("#layerLeft");
        var $right = $("#layerRight");
        var $up = $("#layerUp");
        var $down = $("#layerDown");

        $eventRectangle.mouseenter(function () {
            /* left move event */
            $left.mouseenter(function () {
                /* check if there is enough place to move */
                if ($(this).width() >= $eventRectangle.width()) {
                    /* unbind all layer events */
                    $eventRectangle.unbind();
                    unbindLayerEvents();
                    //Check for existing place to set image on this side
                    if ($(this).width() < $eventRectangle.width() * 2) {
                        $(this).removeClass("canDisplay"); //setting attribute
                    }
                    $right.addClass("canDisplay");
                    /* recalculating position and size of elements */
                    $(this).width($(this).width() - $eventRectangle.width());
                    $right.width($right.width() + $eventRectangle.width());
                    $up.css('left', $(this).width());
                    $eventRectangle.css('left', $(this).width());
                    /* rebind shadows events */
                    bindLayerEvents();
                }
            });
            /* right move event */
            $right.mouseenter(function () {
                /* check if there is enough place to move */
                if ($(this).width() >= $eventRectangle.width()) {
                    /* unbind all layer events */
                    $eventRectangle.unbind();
                    unbindLayerEvents();
                    //Check for existing place to set image on this side
                    if ($(this).width() < $eventRectangle.width() * 2) {
                        $(this).removeClass("canDisplay");  //setting attribute
                    }
                    $left.addClass("canDisplay");
                    /* recalculating position and size of elements */
                    $(this).width($(this).width() - $eventRectangle.width());
                    $left.width($left.width() + $eventRectangle.width());
                    $up.css('left', $left.width());
                    $eventRectangle.css('left', $left.width());
                    /* rebind shadows events */
                    bindLayerEvents();
                }
            });
            /* up move event */
            $up.mouseenter(function () {
                /* check if there is enough place to move */
                if ($(this).height() >= $eventRectangle.height()) {
                    /* unbind all layer events */
                    $eventRectangle.unbind();
                    unbindLayerEvents();
                    //Check for existing place to set image on this side
                    if ($(this).height() < $eventRectangle.height() * 2) {
                        $(this).removeClass("canDisplay");  //setting attribute
                    }
                    $down.addClass("canDisplay");
                    /* recalculating position and size of elements */
                    $(this).height($(this).height() - $eventRectangle.height());
                    $eventRectangle.css('top', $(this).height());
                    $right.height($(this).height() + $eventRectangle.height());
                    $left.height($(this).height() + $eventRectangle.height());
                    $down.height($down.height() + $eventRectangle.height());
                    /* rebind shadows events */
                    bindLayerEvents();
                }
            });
            /* down move event */
            $down.mouseenter(function () {
                /* check if there is enough place to move */
                if ($(this).height() >= $eventRectangle.height()) {
                    /* unbind all layer events */
                    $eventRectangle.unbind();
                    unbindLayerEvents();
                    //Check for existing place to set image on this side
                    if ($(this).height() < $eventRectangle.height() * 2) {
                        $(this).removeClass("canDisplay");  //setting attribute
                    }
                    $up.addClass("canDisplay");
                    /* recalculating position and size of elements */
                    $(this).height($(this).height() - $eventRectangle.height());
                    $up.height($up.height() + $eventRectangle.height());
                    $right.height($up.height() + $eventRectangle.height());
                    $left.height($up.height() + $eventRectangle.height());
                    $eventRectangle.css('top', $up.height());
                    /* rebind shadows events */
                    bindLayerEvents();
                }
            });
        });
    }

    $(window).resize(function () {
        $("#eventRectangle").unbind();
        unbindLayerEvents();
        layerResize();
        bindLayerEvents();
    });

    /* Redrawing layers when user change window size when he is not in our tab */
    $(window).focus(function () {
        $("#eventRectangle").unbind();
        unbindLayerEvents();
        layerResize();
        bindLayerEvents();
    });

    //endregion

    //region ====================== Markers Functions ======================
    function addMarker(location, radius, title) {
        var markerSize = (function(){
                if(title > 9) return 0.7;
                return  0.6;
            })(),
            labelAnchor = (function(){
                if(title > 9) return new google.maps.Point(10, 57);
                return new google.maps.Point(9, 50);
            })(),
            icon = {
            path: "M68.501,23.781 43.752,48.529 66.918,71.695 66.918,120.362 70.085,120.362 70.085,71.694 93.249,48.529",
            fillColor: '#FF0000',
            fillOpacity: .8,
            anchor: new google.maps.Point(70.085, 120.362),
            strokeWeight: 0,
            scale:markerSize
        },
        marker = new MarkerWithLabel({
            position: location,
            map: map,
            radius: radius || 0.5,
            icon: icon,
            labelContent: title,
            labelAnchor: labelAnchor,
            labelClass: "labels", // the CSS class for the label
            labelInBackground: false
        });

        markers.push(marker);
        addMarkerListerner(marker);
    }

    function removeMarkers(){
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    function addMarkerListerner(marker){
        google.maps.event.addListener(marker, 'click', function(){
            if(! mapBlocker()){
                return;
            }
            var markerCoordinates = overlay.getProjection().fromLatLngToContainerPixel(
                new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng())
            );

            getPlaceName(marker.getPosition(), marker.radius);

            mapClickPlaceSelector(markerCoordinates.x, markerCoordinates.y);
            popUpHider('popup');
        });
    }

    //endregion

    //region ====================== Request Functions ======================
    /*  Function for converting div coordinates to google map coordinates */
    function getCoordinates() {
        var eventRectangleBounds = eventRectangle.getBoundingClientRect();

        // coordinates left-top point
        var coordinatesLT = overlay.getProjection().fromContainerPixelToLatLng(
            new google.maps.Point(eventRectangleBounds.left, eventRectangleBounds.top - headerHeight)
        );

        // coordinates right-bottom point
        var coordinatesRB = overlay.getProjection().fromContainerPixelToLatLng(
            new google.maps.Point(eventRectangleBounds.right, eventRectangleBounds.bottom - headerHeight)
        );

        // request to server
        $.ajax({
            url: "/sendcoords",
            type: "POST",
            data: {
                'lat1': coordinatesLT.lat().toFixed(5),
                'lon1': coordinatesLT.lng().toFixed(5),
                'lat2': coordinatesRB.lat().toFixed(5),
                'lon2': coordinatesRB.lng().toFixed(5)
            },
            success: function (result) {
                /* reset attributes*/
                $('.layer').removeClass('imageExist');
                $('.layer img').remove();

                /*images loop*/
                for (var i = 0; i < result.length; i++) {
                    /*creating image*/
                    var img = $('<img class="preview">');
                    img.attr('src', result[i].image);
                    $(".pixel").remove();
                    var pixel = overlay.getProjection().fromLatLngToContainerPixel(new google.maps.LatLng(result[i].latitude, result[i].longitude));
                    img.attr('x', pixel.x);
                    img.attr('y', pixel.y + headerHeight);
                    /*Adding image to one of available shadows*/
                    var freeElements = $('.canDisplay').not(".imageExist");
                    var randomLayerNumber = Math.floor(Math.random() * freeElements.length);
                    freeElements.eq(randomLayerNumber).addClass("imageExist").append(img);
                }
                //Adding SVG tag to layer
                $('#layer svg').remove();
                var tailsContainer = $('<svg width="100%" height="100%">');
                $('#layer').append(tailsContainer);
                //Waiting for images to load on page
                $(".preview").on('load', function () {
                    //appending images to SVG container
                    tailsContainer.append(drawTails($(this).parent(".layer"), $(this)));
                });
            },
            error: function (result) {
                console.log(arguments);
            },
            complete: function () {
            }
        });
    }

    /* Send photo id and receive name of author and place */
    function sendPhotoId(photo){
        $.ajax({
            url: "/sendphotoid",
            type: "POST",
            data: {
                'id': photo.id
            },
            success: function(photoData){
                //console.log(photoData)
                $('#author').html(photoData.autor_photo.last_name + ' ' + photoData.autor_photo.first_name).attr('class', photoData.autor_photo.id);
                $('#ui-id-1').html(photoData.location_name);
            },
            error: function (error) {
                console.log(error);
                $('#author').html(' ');
                $('#ui-id-1').html(' ');
            },
            complete: function () {

            }
        });
    }

    /*  Function for adding 'photo' markers to map*/
    function addPlaces(mapBounds){
        removeMarkers();
        $.ajax({
            url: "/markers",
            type: "POST",
            data: {
                'lat1': mapBounds.getNorthEast().lat().toFixed(6),
                'lon1': mapBounds.getNorthEast().lng().toFixed(6),
                'lat2': mapBounds.getSouthWest().lat().toFixed(6),
                'lon2': mapBounds.getSouthWest().lng().toFixed(6)
            },
            success: function(places){
                /* CAUTION! GAVNO-CODE INSIDE! */
                var placesCoordinates = [],
                    doubtPlaces = [],
                    normalPlaces = [],
                    number = 0,
                    placeRadius = (function(){  // calculating radius for markers, depending on zoom
                        switch (map.getZoom()){
                            case 11:
                                return 0.4;
                            case 12:
                                return 0.25;
                            case 13:
                                return 0.2;
                            case 14:
                                return 0.15;
                            case 15:
                                return 0.1;
                            case 16:
                                return 0.05;
                            default:
                                return 0.025;
                        }
                    })();


                /* Making array of places coordinates */
                $.each(places, function(index, place){
                    placesCoordinates[index] = new google.maps.LatLng(place.latitude, place.longitude);
                });

                /* Making array of places, that have distance between
                 themselves less, than markers' future radius
                 and adding dist field to place object        */
                $.each(places, function(index, place){
                    for(var i = 0; i < placesCoordinates.length; i++){
                        var distance = 0.001 * google.maps.geometry.spherical.computeDistanceBetween (new google.maps.LatLng(place.latitude, place.longitude), placesCoordinates[i]);

                        if( distance.toPrecision(6) < placeRadius && distance !== 0){
                            place.dist = distance.toPrecision(6);
                        }
                    }
                });

                /* Making two arrays: one for no-duplicate places (normalPlaces),
                * other - for "places with neighbours" (doubtPlaces) */
                $.each(places, function(index, place){
                    if(place.dist !== undefined){
                        doubtPlaces.push(places[index]);
                    }else{
                        normalPlaces.push(places[index]);
                    }
                });

                /* Sort array with doubt places*/
                doubtPlaces.sort(function(a, b) {
                    return a.dist - b.dist;
                });

                /* Finally, place markers, that have not neighbors,
                    and other ones with neighbors inherit theirs photos/
                    Neighbor marker marking with nonIterate field */
                for(var i = 0; i < doubtPlaces.length; i++){
                    if(! doubtPlaces[i].nonIterate){
                        if( doubtPlaces[i+1] !== undefined && doubtPlaces[i].dist == doubtPlaces[i+1].dist){
                            doubtPlaces[i].count_photo += doubtPlaces[i+1].count_photo;
                            addMarker(new google.maps.LatLng(doubtPlaces[i].latitude, doubtPlaces[i].longitude), placeRadius, doubtPlaces[i].count_photo.toString());
                            doubtPlaces[i+1].nonIterate = true;
                        }else if (doubtPlaces[i+1] == undefined){
                            addMarker(new google.maps.LatLng(doubtPlaces[i].latitude, doubtPlaces[i].longitude), placeRadius, doubtPlaces[i].count_photo.toString());
                        }
                    }
                }
                /* Place all places without neighbours*/
                for(var i = 0; i < normalPlaces.length; i++){
                    addMarker(new google.maps.LatLng(normalPlaces[i].latitude, normalPlaces[i].longitude), placeRadius, normalPlaces[i].count_photo.toString());
                }
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {

            }
        });
    }

    function getUserPhotos(node, idOrClass, callback){
        node.off().click(function(){
            $.ajax({
                url: "/photos_author",
                type: "POST",
                data: {
                    'id': node.attr(idOrClass)
                },
                success: function(allUserPhotos){
                    var imageNode = '<li class="user-photo">' +
                                        '<div class="img"><img src="$1" id="$2" ></div>' +
                                        '<ul>' +
                                            '<li>Дата: $3</li>' +
                                            '<li>Місце: $4</li>' +
                                        '</ul>' +
                                    '</li>';
                    $.each(allUserPhotos, function(index, userPhoto){
                        var newImg = prepare(imageNode, userPhoto.photo.image, userPhoto.photo.id, userPhoto.photo.photo_date, userPhoto.photo.location_name);
                        userPhotos.find('.photo_list').append(newImg);
                    });

                    $('#user-author-title').html(node.text());

                    callback();
                },
                error: function (error) {
                    console.log(error);

                },
                complete: function () {

                }
            });
        });
    }

    function getPlaceName(latLng, radius){
        $('#location_latitude').val(latLng.lat().toFixed(6));
        $('#location_longitude').val(latLng.lng().toFixed(6));
        $('#lat').val(latLng.lat().toFixed(6));
        $('#lon').val(latLng.lng().toFixed(6));
        $('#radius').val(radius); //0.5 Kilometers - default radius

        var request = {
            location: latLng,
            radius: radius,
            rankBy: google.maps.places.RankBy.PROMINENCE
        };

        placesService.search(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $('#place-name').html("Біля " + results[0].name);
                $('#location_name').val(results[0].name);
            }
        });
    }


    function addPhotoDialogs(node){
        node.off().click(function(){
            var thisNode = $(this);
            $.ajax({
                url: "/sendphotoid",
                type: "POST",
                data: {
                    'id': thisNode.find('img').attr('id')
                },
                success: function(photoData){
                    $('#dialog-photo').attr('src', photoData.photo.image)[0].onload = function(){
                        $("#dialog-content").dialog({
                            width:   this.naturalWidth,
                            height:  this.naturalHeight,
                            resizable: false,
                            draggable: false,
                            modal: true,
                            title: photoData.location_name || ' '
                        });
                    };
                },
                error: function (error) {
                    console.log(error);
                },
                complete: function () {

                }
            });
        });
    }

    //endregion

    //region ====================== Visual functions ======================
    function showPhoto(photo){
        popUpHider('all');
        $('#photo').html(photo);
        $("#show-photo").dialog({
            height: $(photo).height()+100,
            width: $(photo).width()+100,
            resizable: false,
            draggable: false,
            open: function(){
                getUserPhotos($('#author'), 'class', function(){
                    popUpHider('userPhotos');
                    hideButtonForChangeMode(true);
                    setTimelineOpen(false);
                    $('#show-photo').dialog('close');
                    $('#userPhotosClose').click(function(){
                        $('.user-photo').remove();
                        popUpHider('timeline');
                        setTimelineOpen(true);
                        hideButtonForChangeMode(false);
                    });

                    addPhotoDialogs($('.user-photo'));
                });
                sendPhotoId(photo);
                mapBlocked(true);
            },
            close: function(){
                if($('.photos').hasClass('active')){
                    popUpHider('timeline');
                    mapBlocked(false);
                }else{
                    popUpHider('userPhotos');
                    mapBlocked(false);
                }

            }
        });
    }

    /* Drawing tails for previews*/
    function drawTails(container, img) {
        //creating path element
        xmlns = "http://www.w3.org/2000/svg";
        var tail = document.createElementNS(xmlns, "path");
        //get position in DOM
        var imgPosition = img.offset();
        var rectPosition = $("#eventRectangle").offset();
        //checking for direction of tail and calculating coordinates
        if (container.hasClass('left')) {
            var startX = Math.round(imgPosition.left + img.width());
            var startY = Math.round(imgPosition.top + img.height() / 3);
            startX = startX + 10;//correcting width by difference caused by image padding (5px)
            var endX = startX;
            var endY = startY + Math.round(img.height() / 4);
        } else if (container.hasClass('right')) {
            var startX = Math.round(imgPosition.left);
            var startY = Math.round(imgPosition.top + img.height() / 3);
            var endX = startX;
            var endY = startY + Math.round(img.height() / 4);
        } else if (container.hasClass('up')) {
            var startX = Math.round(imgPosition.left + img.width() / 3);
            var startY = Math.round(imgPosition.top + img.height());
            startY = startY + 10; //correcting height by difference caused by image padding (5px)
            var endX = startX + Math.round(img.width() / 4);
            var endY = startY;
        } else if (container.hasClass('down')) {
            var startX = Math.round(imgPosition.left + img.width() / 3);
            var startY = Math.round(imgPosition.top);
            var endX = startX + Math.round(img.width() / 4);
            var endY = startY;
        }
        var pointX = img.attr("x");
        var pointY = img.attr("y");
        //correcting height by difference caused by header
        startY = startY - headerHeight;
        pointY = pointY - headerHeight;
        endY = endY - headerHeight;

        //creating path direction
        var path = "M" + startX + " " + startY + " L" + pointX + " " + pointY + " L" + endX + " " + endY + " Z";
        tail.setAttributeNS(null, "d", path);
        return tail;
    }

    function mapClickPlaceSelector(x,y){
        var container = popup.parent();
        var xDim = popup.width(),
            yDim = popup.height();
        var containerXDim = container.width(),
            containerYDim = container.height();
        var destinationX = x,
            destinationY = y;
        var position = 0;
        if ((x + xDim > containerXDim) && (y + yDim > containerYDim)){
            destinationX = x - xDim;
            destinationY = y - yDim;
            position = 3;
        }else if (x + xDim > containerXDim){
            destinationX = x - xDim;
            position = 2;
        }else if (y + yDim > containerYDim){
            destinationY = y - yDim;
            position = 1;
        }
        switch(position){
            case 0:
                popup.removeClass();
                popup.addClass('top-left');
                break;
            case 1:
                popup.removeClass();
                popup.addClass('bottom-left');
                break;
            case 2:
                popup.removeClass();
                popup.addClass('top-right');
                break;
            case 3:
                popup.removeClass();
                popup.addClass('bottom-right');
                break;
        }
        popup.css({'top': destinationY, 'left': destinationX});
    }

    //endregion

    //region ====================== Decorators ======================
    /* This function makes delay in milliseconds and than
     does the function(second argument) with saved "this" and "arguments"  */
    function limited(time, func) {
        var args, whoIsThis;
        var isCalled = false;
        if (typeof time === "function") {
            func = time;
            time = 20;
        }

        return function () {
            whoIsThis = this;
            args = arguments;
            if (isCalled == false) {
                isCalled = true;
                setTimeout(function () {
                    func.apply(whoIsThis, args);
                    isCalled = false;
                }, time);
            }
        };
    }

    // set default map view when you load page
    function setDefaultMapView() {
        panMapView();
        popUpHider('layer');
        hideButtonForChangeMode(true);
    }

    function showPopUp(){
        var popups = {
            popup: $('#click-on-map'),
            timeline: $('.photos'),
            upload: $('#uploadPhoto'),
            layer: $('#layer'),
            userPhotos: $('.user-photos')
        };
        for(var pop in popups){
            popups[pop].hide();
        }
        return function(popUpName){

            for(var pop in popups){
                popups[pop].hide();
            }

            switch (popUpName){
                case 'all':
                    mapBlocked(false);
                    return;
                case 'upload':
                    mapBlocked(true);
                    break;
            }
            return popups[popUpName].fadeIn();
        }
    }

    function prepare(fullString){
        var replace = arguments;

        return fullString.replace(/\$(\d)/g, function(x, indexOfArguments){

            return replace[indexOfArguments];
        });
    }

    //endregion

    //region ====================== ImageUploadPopup ======================
    $("#imageUpload").click(function() {
        popUpHider('upload');
        $('#uploadPhoto h3').html($('#place-name').html());
        addEmptyRow();
        $('#submitButton').attr("disabled", "disabled");
    });

    /**
     * Function for validate file size and format
     * @param file
     * @returns {boolean}
     */
    function isFileValid(file){
        if(file.type.match(/jpg|jpeg|png|bmp/)){
            switch (file.size){
                case file.size > 10000000:
                    return errorMessagesForUpload('more');
                case file.size < 10000:
                    return errorMessagesForUpload('less');
                default:
                    return true;
            }
        }else return errorMessagesForUpload('type');
    }

    function errorMessagesForUpload(errorType){
        var uk = {
                more: "Файл має бути менше 10 мегабайт!",
                less: "Файл має бути хоча б 10 кілобайт!",
                type: "Дозволені типи файлів: jpg,jpeg,png,bmp."
            },
            en = {
                more: "File must be under 10 mB!",
                less: "File must be more than 10 kB!",
                type: "Required photo type: jpg,jpeg,png,bmp."
            },
            ru = {
                more: "Файл должен быть меньше 10 мегабайт!",
                less: "Файл должен иметь размер хотя бы 10 килобайт!",
                type: "Разрешенные форматы файлов: jpg,jpeg,png,bmp."
            };
        switch (currentLanguage){
            case 'uk':
                return uk[errorType];
            case 'ru':
                return ru[errorType];
            case 'en':
                return en[errorType];
        }
    }

    /**
     * Function for creating preview for selected for upload image
     * @param input
     */
    function showPreview(input) {
        var src;
        if ('files' in input) { // File API supported (webkit/FF)
            var file = input.files[0];
            src = window.URL ?
                window.URL.createObjectURL(file) :
                window.webkitURL.createObjectURL(file); //Need hack for Safari
        } else {
            if (/fake/.test(input.value)) {
                // fallback to whatever (IE8, IE9)
            } else {
                src = input.value; // exploits the IE security hole
            }
        }
        return $(new Image()).attr('src',src); // the local image!
    }

    /**
     * Function for creating empty div-containers for
     * for photos preview in case of multiupload
     * @param file
     */
    function addEmptyRow() {
        var num     = new Number($('.imageRow').last().attr('id').substring(8)),
            newNum  = new Number(num + 1),
            size = $('.imageRow').length;
        //disable adding if 3 images exist
        if (size < 3){
            $(".input_date").datepicker("destroy");
            var isNewRow = $('.miniature').is(':empty');
            var newElem = (size == 1 && isNewRow ) ? $('#imageRow' + num) : $('#imageRow' + num).clone().attr('id', 'imageRow' + newNum);
            newNum = (size == 1 && isNewRow ) ? num : newNum;
            // create the new element via clone(), and manipulate it's ID using newNum value
            // manipulate the name/id values of the input inside the new element

            // Miniature and Image
            newElem.find('.input_image_container').attr('id', 'input_image_container_' + (newNum)).show();
            newElem.find('.input_image').unbind();
            newElem.find('.input_image').attr('id', 'location_photos_attributes_' + (newNum) + '_image')
                .attr('name', 'location[photos_attributes][' + (newNum) + '][image]').val('').change(function() {
                showImageRow(this);
            });
            newElem.find('.miniature').attr('id', 'miniature' + newNum).empty().hide();
            newElem.find('.errorDate').empty().hide();

            // Date
            newElem.find('.label_date').attr('for', 'location_photos_attributes_' + (newNum) + '_photo_date').hide();
            newElem.find('.input_date').attr('id', 'location_photos_attributes_' + (newNum) + '_photo_date')
                .attr('name', 'location[photos_attributes][' + (newNum) + '][photo_date]').attr("disabled", "disabled").val('').change(function() {
                    checkDate();
                }).hide();

            // Delete button
            newElem.find('#delete-image').hide().click(function(){
                removeImageRow(newElem, false)
            });
            // insert the new element after
            if (!isNewRow ) {
                var elem = $('#imageRow' + num).after(newElem);
                $(".input_date").datepicker({ dateFormat: 'dd-mm-yy', changeMonth: true, changeYear: true, maxDate: "+0D", yearRange : '1800:c'});
            }
        }
        //scroll to element
        $('#photo-list').scrollTop($('#photo-list').scrollTop() + $('#imageRow' + ((size <= 3) ? num : newNum)).position().top);
    }

    /**
     * Function for showing div-containers for
     * for photos preview in case of multiupload
     * @param file
     */
    function showImageRow(input) {
        var num = new Number($('.imageRow').last().attr('id').substring(8)),
            elem = $('#imageRow' + num);

        // Miniature and Image
        if(isFileValid(input.files[0]) == true){
            elem.find('.input_image_container').hide();
            elem.find('.miniature').html(showPreview(input)).show();
            elem.find('.errorDate').empty().show();
            // Date
            elem.find('.label_date').show();
            elem.find('.input_date').removeAttr("disabled").show();
            // Delete button
            elem.find('#delete-image').show();
            addEmptyRow();
            checkDate();
        }else {
            elem.find('.miniature').empty();
            elem.find('.errorDate').html(isFileValid(input.files[0])).show();
            elem.find('#delete-image').show();
            $('#submitButton').attr("disabled", "disabled");
        }
    }

    /**
     * Function for removing div-containers,
     * if photo was deleted
     * @param elem
     */
    function removeImageRow(elem, all) {
        var num = $('.imageRow').length - 1;
        var lastElem = $('.imageRow').last();

        var emptyRow = lastElem.find('.miniature').is(':empty'),
            errorRow = lastElem.find('.errorDate').is(':empty');

        elem.find('.miniature').empty();
        elem.find('#delete-image').unbind();
        elem.find('.input_image').unbind();
        elem.find('.input_date').unbind().val('');
        elem.find('#date-error').empty();

        if(num == 1 && (!emptyRow || errorRow)){
            elem.remove();
            popUpHider('all');
        }else if(num == 0 || all){
            popUpHider('all');
        }else{
            addEmptyRow();
            checkDate();
            elem.remove();
        }
    }

    $('#uploadClose').click(function(){
        $('.imageRow').each(function(){
            removeImageRow($(this), true);
        });
    });

//    $('#submitButton').click(function(){
//         $('.upload').attr("disabled", "disabled");
//         $('.input_image').attr("disabled", "disabled");
//         $('#delete-image').attr("disabled", "disabled");
//         $('#submitButton').trigger('click');
//
//    });

    $('.input_date').datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        maxDate: "+0D",
        yearRange : '1800:c'
    });

    $("#new_location").validate({
        errorPlacement: function ($error, $element) {
            $element.next('.errorDate').append($error);
        }
    });

    $.validator.addMethod('daterange', function(value, element) {
        if (this.optional(element)) {
            return true;
        }

        var parts = value.split('-');
        var today = Date.parse(new Date()),
            lowerDate = Date.parse(new Date(1800,0,01)),
            enteredDate = Date.parse(new Date(parts[2], parts[1]-1, parts[0]));


        if (isNaN(enteredDate)) {
            return false;
        }

        return (enteredDate <= today && lowerDate <= enteredDate);
    }, "Please specify a date earlier than today!");

    function checkDate(){
        var rowNumber = $('.miniature').length;
        var emptyRow = false;
        if (rowNumber == 1){
            var emptyRow = $('.miniature').is(':empty');
        }
        if ($("#new_location").valid() && !emptyRow) {
            $('#submitButton').removeAttr("disabled");
        }else{
            $('#submitButton').attr("disabled", "disabled");
        }
    }

    //endregion

    //region ====================== Map For Admin ======================
    window.mapEditInit = function (){
       var markerPosition = new google.maps.LatLng($('#latitude').val(), $('#longitude').val()),
           editMapDiv = document.getElementById('edit-photo-map'),
           editMapOptions = {
                center: markerPosition,
                zoom: 15,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL
                },
                disableDoubleClickZoom: true,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                rotateControl: false,
                panControl: false,
                overviewMapControl: false,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
           },
           editMap = new google.maps.Map(editMapDiv, editMapOptions),
           mapStyles = [
                 {
                   featureType: "all",
                   stylers: [
                     { saturation: -80 }
                   ]
                 },
                 {
                   featureType: "road.arterial",
                   elementType: "geometry",
                   stylers: [
                     { hue: "#ff9900" },
                     { saturation: 100 }
                   ]
                 },
                 {
                   featureType: "poi.business",
                   elementType: "labels",
                   stylers: [
                     { visibility: "off" }
                   ]
                 },
                 {
                   "featureType": "administrative.locality",
                   "elementType": "labels",
                   "stylers": [
                     { "hue": "#ffbb00" },
                     { "saturation": 100 },
                     { "visibility": "off" }
                   ]
                 }
           ],
           marker = new google.maps.Marker({
               position: markerPosition,
               map: editMap,
               draggable:true
           }),
           placesService = new google.maps.places.PlacesService(editMap),
           requestGlobal,
           requestDetailed;

        editMap.set('styles', mapStyles);

        google.maps.event.addDomListener(marker, 'dragend', function(event){
            $('#latitude').val(event.latLng.d.toFixed(6));
            $('#longitude').val(event.latLng.e.toFixed(6));

            requestGlobal = {
                location: event.latLng,
                radius: 10,
                rankBy: google.maps.places.RankBy.PROMINENCE
            };

            placesService.search(requestGlobal, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {

                    requestDetailed = {
                        reference:  results[0].reference
                    };

                    placesService.getDetails(requestDetailed, function(place, status){
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            $('#place-name').empty().html(place.formatted_address);
                        }
                    });
                }
            });
        });

        google.maps.event.addDomListener(editMap, 'click', function(event){
            marker.setPosition(event.latLng);
            $('#latitude').val(event.latLng.d.toFixed(6));
            $('#longitude').val(event.latLng.e.toFixed(6));

            requestGlobal = {
                location: event.latLng,
                radius: 10,
                rankBy: google.maps.places.RankBy.PROMINENCE
            };

            placesService.search(requestGlobal, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {

                    requestDetailed = {
                        reference:  results[0].reference
                    };

                    placesService.getDetails(requestDetailed, function(place, status){
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            $('#place-name').empty().html(place.formatted_address);
                        }
                    });
                }
            });
        });

    };
    //endregion

});