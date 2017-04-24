/**
 * La liste des restaurants
 */
// charge en mémoire dans la variable globale 'restaurants' 
// la liste de restaurants du fichier 'restaurants.json' sous forme de données JSON
// @link: http://stackoverflow.com/questions/2177548/load-json-into-variable
var restaurant = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "restaurants.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

// tableau qui contient les positions des restaurants
var locations = [];
for (i in restaurant) {
	locations[i] = { lat: restaurant[i].lat, lng: restaurant[i].long };
};
// filtre x et y pour les étoiles
var filtreX = 0;
var filtreY = 5;

genererListeRestaurants();


var propStreetView = {
	key : "AIzaSyByBJuw5KmFoet1QtQ9xQkk_deUNQmrKyo",
	size : "300x150"	
};

// Genere la liste des restaurants
function genererListeRestaurants() {
	$.getJSON("restaurants.json", function(restaurants){
		for (i in restaurants) {
			var totalEtoile = 0;
			for (j in restaurants[i].ratings) {				
				totalEtoile += restaurants[i].ratings[j].stars;
			}
			var moyenneAvis = totalEtoile/restaurants[i].ratings.length;
			console.log("moyenne Avis = " + moyenneAvis);
			var urlStreetView = 'https://maps.googleapis.com/maps/api/streetview?'+
				'size=' + propStreetView.size +
				'&location=' + restaurants[i].lat + ',' + restaurants[i].long +
				'&key=' + propStreetView.key;
			$('#listeRestaurants').append(
				'<a class="list-group-item" id="restaurant'+i+'" data-toggle="collapse" href="#collapse'+i+'">'+
					'<div class="row">'+
					    '<div class="col-xs-4" style="height:100%;">'+
							'<img class="img-responsive" src="'+urlStreetView+'" />'+	            
				        '</div>'+
				        '<div class="clo-xs-8">'+
							'<h4 class="list-group-item-heading">'+ restaurants[i].restaurantName +'</h4>'+
							'<p class="list-group-item-text">'+
								restaurants[i].address +'<br/>'+
								restaurants[i].lat + ', ' + restaurants[i].long +'<br/>'+
								'<span id="moyenneAvis'+i+'" style="color:orange; font-size:15px"><strong>'+
									moyenneAvis +
								'</strong></span> - ' +
								restaurants[i].ratings.length + ' avis'+					
							'</p>'+
						'</div>'+
						'<div class="col-xs-12 collapse" id="collapse'+i+'"></div>'+
					'</div>'+
				'</a>'
			);
			for (j in restaurants[i].ratings) {				
				$('#collapse'+i).append(
					'<span style="color:orange; font-size:14px">' + restaurants[i].ratings[j].stars + '/5 '+'</span>'+
					'<span style="font-size:12px">\"'+ restaurants[i].ratings[j].comment+'\"</span><br/>'
				);
			}
			
		}
	});
};







