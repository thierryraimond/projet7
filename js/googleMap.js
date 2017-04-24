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
		}
	};
	// tableau des marqueurs des restaurants
	var markers = locations.map(function(location, i) {
		// pour chaque location ajoute un marqueur restaurant personnalisé
		var marker = new google.maps.Marker({
			position: location,
			icon: icons["restaurant"].icon,
			map: map
		});
		google.maps.event.addListener(marker, 'click', function() {
			$('#collapse'+i).collapse('toggle');
		});
		return marker;
	});
	
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
    
//	afficherRestaurantsCarte(icons, map);
	
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
    	}, function() {
    		handleLocationError(true, infoWindow, map.getCenter());
    	});
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
};

//Browser doesn't support Geolocation
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
};

// Ajouter un marqueur personnalisé sur la carte et un événément quand on clique dessus
function ajouterMarqueur(restaurant, icons, map, type, i) {
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(restaurant[i].lat, restaurant[i].long),
		icon: icons[type].icon,
		map: map
	});
	google.maps.event.addListener(marker, 'click', function() {
		$('#collapse'+i).collapse('toggle');
	});
};

// Afficher tous les restaurants du fichier json sur la carte avec une icone personnalisée
function afficherRestaurantsCarte(icons, map) {
	var type = "restaurant";
	var temp = [];
	// On récupère la liste des restaurants du fichier json
	$.getJSON("restaurants.json", function(restaurants) {
		for(i in restaurants) {
			ajouterMarqueur(restaurants, icons, map, type, i);
		}
	});
};

