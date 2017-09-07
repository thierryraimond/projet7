/**
 * 
 */
function initMap() {
	// par défaut (geolocalisation non activé) affiche les coordonnées suivantes
	var myCenter = {lat: 48.873838, lng: 2.350529};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 5,
		center: myCenter
	});
	// marqueur de l'utilisateur
	var marker = new google.maps.Marker({
		position: myCenter,
		map: map
	});
	// icone personalisée
	var icons = {
		restaurant: {
			name: 'Restaurant',
			icon: 'img/restaurant_icon.png'
		},
		yelp: {
			name: 'Restaurant',
			icon: 'img/marqueur_yelp_32x32_trans.png'
		}
	};
	
	// créer un tableau de marqueur de restaurant
	var markers = new Array();
	// pour chaque restaurant on ajoute un marqueur personnalisé sur la carte
	// et un événément associé quand on clique dessus
	for (i in restaurants){
		ajouterMarqueur(map, restaurants[i].lat, restaurants[i].long, "restaurant");
	}
	
	// Ajoute un marqueur personnalisé au tableau markers et un écouteur d'événement associé au marqueur
	function ajouterMarqueur(map, latitude, longitude, typeIcon) {
		var index = markers.length; // récupère le nouvel index du tableau markers
		// création du nouveau marqueur sur la carte et ajout de l'objet au tableau markers à la suite
		markers[index] = new google.maps.Marker({
			position: { lat: latitude, lng: longitude },
			icon: icons[typeIcon].icon,
			map: map
		});
		// ajoute également un écouteur d'événement quand on clique sur le marqueur
		google.maps.event.addListener(markers[index], 'click', function() {
//			$('#collapse'+index).collapse('toggle');
			$('#restaurant'+index).trigger('click');
		});	
	}

	
	// Quand on change le filtreX
	$('#filtreX').on('change', function(){
		filtreX = parseInt($(this).val());
		filtreY = parseInt($('#filtreY').val());
		filtreMarqueurs(map, filtreX, filtreY);
		console.log("filtreX = " + parseInt($(this).val())+"\n"+
			"filtreY = " + parseInt($('#filtreY').val())
		);
	});
	// Quand on change le filtreY
	$('#filtreY').on('change', function(){
		filtreX = parseInt($('#filtreX').val());
		filtreY = parseInt($(this).val());
		filtreMarqueurs(map, filtreX, filtreY);
		console.log("filtreX = " + parseInt($('#filtreX').val())+"\n"+
			"filtreY = " + parseInt($(this).val())
		);
	});
	
	// quand on clique sur la carte une fenêtre modale apparait et propose de créer un restaurant
	google.maps.event.addListener(map, 'click', function(event) {
		$('#nomNouveauRestaurant').val(''); // le champ de saisie est vide
		var location = event.latLng;
		// On va utiliser la fonctionnalité Geocoder pour obtenir l'adresse à partir de la location
		// @link: http://stackoverflow.com/questions/36892826/click-on-google-maps-api-and-get-the-address
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'latLng': location }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
			        var adresse = results[0].formatted_address;
			        $("#adresseNouveauRestaurant").text(adresse);
			    }
			}
	    });
		var urlStreetView = 'https://maps.googleapis.com/maps/api/streetview?'+
			'size=' + propStreetView.size +
			'&location=' + location.lat() + ',' + location.lng() +
			'&key=' + propStreetView.key;
		
		$("#latitudeNouveauRestaurant").text(location.lat());
		$("#longitudeNouveauRestaurant").text(location.lng());

		$('#imageNouveauRestaurant img').attr('src', urlStreetView);
		$('#genererRestaurant').modal('show');		
		
	});
	
	// quand on clique sur le bouton valider nom du nouveau restaurant de la fenêtre modale
	$('#btnValiderNomNouveauRestaurant').on('click', function() {
		// contrôle si le champ du nom du nouveau restaurant n'est pas vide
		if($('#nomNouveauRestaurant').val() != '') {
			ajouterRestaurant();
			// ajout d'un nouveau marqueur restaurant et un écouteur d'événement associé
			ajouterMarqueur(map, parseFloat($("#latitudeNouveauRestaurant").text()), parseFloat($("#longitudeNouveauRestaurant").text()), "restaurant");
			$('#genererRestaurant').modal('hide');
		} else {
			$('#alertNouveauRestaurant').removeClass().addClass('alert alert-danger')
			.text('le champ est vide')
			.show(500).delay(3000).hide(500);
		}
	});
	
	// au changement du cadre de la carte (zoom, deplacement sur la carte, drag)
    google.maps.event.addListener(map, 'bounds_changed', function() {
    	filtreMarqueurs(map, filtreX, filtreY);
    });
    
    // Filtre les marqueures puis affiche les restaurants si ils existent sur la carte actuelle
    function filtreMarqueurs(map, filtre1, filtre2) {
    	for (var i=0; i<markers.length; i++){
    		var moyenneAvis = parseFloat($('#moyenneAvis'+i).text());
    		if (moyenneAvis >= filtre1 && moyenneAvis <= filtre2){
    			markers[i].setVisible(true);
    		} else {
    			markers[i].setVisible(false);
    		}
    		// si le cadre actuel de la carte contient le marqueur
        	if( map.getBounds().contains(markers[i].getPosition()) && markers[i].getVisible()){
        		$('#restaurant'+i).show(); // alors on affiche le restaurant dans la liste à côté
        	} else {
        		$('#restaurant'+i).hide(); // sinon on cache le restaurant dans la liste à côté
        	}
    	}
    };
    

    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
    		var pos = {
    			lat: position.coords.latitude,
    			lng: position.coords.longitude
    		};
    		   		
    		infoWindow.setPosition(pos);
    		infoWindow.setContent('Vous êtes ici.');
    		map.setCenter(pos);
    		marker.setPosition(pos);
    		marker.setAnimation(google.maps.Animation.BOUNCE);
    		

    		// appel fonction yelp avec la position de l'utilisateur
    		yelpSearch(pos.lat, pos.lng, map.getBounds());
    		
    	}, function() {
    		handleLocationError(true, infoWindow, map.getCenter());
    	});
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
    
    //Browser doesn't support Geolocation
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
    };
    
    /*************************************************************
     ************************* YELP ******************************
     *************************************************************/
    
    // yelp search
    function yelpSearch(latitude, longitude, mapBounds) {
    	var terms = 'restaurants';
//    	var near = 'San+Francisco';
    	var position = latitude + ',' + longitude;
//    	var bounds = mapBounds.getSouthWest().lat() + ',' + mapBounds.getSouthWest().lng() + '|' +
//    		mapBounds.getNorthEast().lat() + ',' + mapBounds.getNorthEast().lng() ;


    	var parameters = [];
    	parameters.push([ 'term', terms ]);
//    	parameters.push([ 'location', near ]);
//    	parameters.push([ 'radius_filter', 400 ]);
//    	parameters.push([ 'bounds', bounds ]);
    	parameters.push([ 'll', position ]);
    	parameters.push([ 'callback', 'cb' ]);
    	parameters.push([ 'oauth_consumer_key', auth.consumerKey ]);
    	parameters.push([ 'oauth_consumer_secret', auth.consumerSecret ]);
    	parameters.push([ 'oauth_token', auth.accessToken ]);
    	parameters.push([ 'oauth_signature_method', 'HMAC-SHA1' ]);

    	var message = {
    		'action' : 'https://api.yelp.com/v2/search',
    		'method' : 'GET',
    		'parameters' : parameters
    	};

    	OAuth.setTimestampAndNonce(message);
    	OAuth.SignatureMethod.sign(message, accessor);

    	var parameterMap = OAuth.getParameterMap(message.parameters);
    	parameterMap.oauth_signature = OAuth
    			.percentEncode(parameterMap.oauth_signature)

    	$.ajax({
    		'async': false,
    		'global': false,
    		'url' : message.action,
    		'data' : parameterMap,
    		'cache' : true,
    		'dataType' : 'jsonp',
    		'jsonpCallback' : 'cb',
    		'success' : function(data, textStats, XMLHttpRequest) {
    			console.log(data);  			
    			// pour chaque restaurant de Yelp 
    			for (i in data.businesses){
    				var n = restaurants.length;
    				var adresse = ""; // récupération de l'adresse situé dans un tableau
    				for (j=0; j<3 ;j++) {
    					if (j == 2) {
    						adresse += data.businesses[i].location.display_address[j];
    					} else {
    						adresse += data.businesses[i].location.display_address[j] + ', ';
    					}    					
    				}
    				// on ajoute le restaurant Yelp au tableau json restaurants
    				restaurants[n] = {
    					"restaurantName":data.businesses[i].name,
    					"address":adresse,
    					"lat":data.businesses[i].location.coordinate.latitude,
    					"long":data.businesses[i].location.coordinate.longitude,
    					"ratings":[]
    				};
    				// Récupère les avis du restaurant Yelp à partir de l'id du Restaurant sans accent
//    				yelpBusiness(remplacerAccent(data.businesses[i].id), n);
    				
    				// ajout du restaurant Yelp à la liste à côté de la carte
    				genererRestaurant(n); // ajout des infos du restaurants
    				
    				// ajoute le logo de yelp
    				$('#restaurant'+n).append(
    					'<div class="yelpLogo">'+
    						'<img src="img/Yelp-logo.png" width=53 height=30>'+
    					'</div>'
    				);

    				// ajout des notes et nombre d'avis Yelp
    				$('#infoRestaurant'+n).append(
    					'<img src="'+ data.businesses[i].rating_img_url +'"> ' +
    					'<strong><span id="yelpNote'+n+'" style="color:orange; font-size:15px">'+ data.businesses[i].rating +'</span></strong>' +
    					' - <span id="yelpTotalAvis'+n+'">'+ data.businesses[i].review_count +' avis</span> '+
    					'<img src="img/Yelp-logo.png" width=36 height=20>'
    				);
    				// recalcule la moyenne des notes et le total d'avis en intégrant Yelp
    				// mettre à jour la moyenne des avis et le nombre d'avis
    				$('#moyenneAvis'+n).text(calculerMoyenneAvis(n));
    				$('#textMoyenneAvis'+n).text(calculerMoyenneAvis(n));
    				$('#nbAvis'+n).text((restaurants[n].ratings.length + data.businesses[i].review_count) + " avis");
    				
    				// on ajoute un marqueur personnalisé sur la carte et un événément associé quand on clique dessus
    				ajouterMarqueur(map, data.businesses[i].location.coordinate.latitude, data.businesses[i].location.coordinate.longitude, "yelp");
    				// ajout à la div collapse une div qui comprend l'id du restaurant
    				$('#collapse'+n).append('<div id="'+remplacerAccent(data.businesses[i].id)+'"></div>');
    			}
    		}
    	});
    };

};




