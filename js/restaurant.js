/**
 * La liste des restaurants
 */
// charge en mémoire dans la variable globale 'restaurants' 
// la liste de restaurants du fichier 'restaurants.json' sous forme de données JSON
// @link: http://stackoverflow.com/questions/2177548/load-json-into-variable
var restaurants = (function () {
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

// filtre x et y pour les étoiles
var filtreX = 0;
var filtreY = 5;

var propStreetView = {
	key : "AIzaSyByBJuw5KmFoet1QtQ9xQkk_deUNQmrKyo",
	size : "300x150"	
};



// Genere la liste des restaurants
function genererListeRestaurants() {
	for (i in restaurants) {
		genererRestaurant(i);
		for (j in restaurants[i].ratings) {				
			$('#collapse'+i).append(
				'<span style="color:orange; font-size:14px">' + restaurants[i].ratings[j].stars + '/5 '+'</span>'+
				'<span style="font-size:12px">\"'+ restaurants[i].ratings[j].comment+'\"</span><br/>'
			);
		}	
	}
};

function genererRestaurant(i) {
	var moyenneAvis = calculerMoyenneAvis(i);
	var textMoyenneAvis = moyenneAvis;
	if (moyenneAvis == 0 && restaurants[i].ratings.length == 0) {
		textMoyenneAvis = "aucune note";
	}
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
						'<span id="moyenneAvis'+i+'" style="display:none;">'+moyenneAvis +'</span>'+
						'<strong><span id="textMoyenneAvis'+i+'" style="color:orange; font-size:15px">'+
							textMoyenneAvis +
						'</span></strong> - ' +
						'<span id="nbAvis'+i+'">' + restaurants[i].ratings.length + ' avis</span>'+					
					'</p>'+
				'</div>'+
				'<div class="col-xs-12" style="padding-top:10px;">'+
					'<div class="row">'+
						'<div class="col-xs-2 form-group">'+
							'<button class="btnAjouterAvis btn btn-primary" id="btnAjouterAvis'+i+'" title="Ajouter un nouvel avis">'+
								'<span class="glyphicon glyphicon-plus"></span>'+
							'</button>'+
						'</div>'+
						'<div class="col-xs-10 form-group" id="ajouterNouveauAvis'+i+'" style="display:none;">'+
							'<div>'+
								'<i class="fa fa-star star" id="star1_'+i+'" ></i>'+
								'<i class="fa fa-star star" id="star2_'+i+'" ></i>'+
								'<i class="fa fa-star star" id="star3_'+i+'" ></i>'+
								'<i class="fa fa-star star" id="star4_'+i+'" ></i>'+
								'<i class="fa fa-star star" id="star5_'+i+'" ></i>'+
								'<span id="note'+i+'" style="display:none;">0</span>'+
							'</div>'+
							'<div class="input-group">'+
								'<input class="form-control" id="nouveauAvis'+i+'" name="nouveauAvis" placeholder="Saisissez un nouvel avis" value="" type="text" required>'+
								'<span class="input-group-btn"><button type="submit" class="btn btn-success validerNouveauAvis" id="btnValiderNouveauAvis'+i+'"><span class="glyphicon glyphicon-ok"></span></button></span>'+
							'</div>'+
							'<div class="alert alert-danger" style="display:none;" id="alert'+i+'" role="alert">erreur</div>'+
						'</div>'+
					'</div>'+		
				'</div>'+
				'<div class="col-xs-12 collapse" id="collapse'+i+'"></div>'+
			'</div>'+
		'</a>'
	);
};

function ajouterRestaurant() {
	var nom = $('#nomNouveauRestaurant').val();
	var adresse = $('#adresseNouveauRestaurant').text();
	var latitude = $('#latitudeNouveauRestaurant').text();
	var longitude = $('#longitudeNouveauRestaurant').text();
	var n = restaurants.length;
	// ajout du restaurant au tableau json
	restaurants[n] = {
		"restaurantName":nom,
		"address":adresse,
		"lat":latitude,
		"long":longitude,
		"ratings":[]
	};
	// ajout du restaurant à la liste à côté de la carte
	genererRestaurant(n);	
};



function idEtoile (that){
	for (i in restaurants) {
		for (var numStar=1 ; numStar<=5; numStar++) {
			if(that == 'star'+numStar+'_'+i) {
				var star = {i: i, numStar: numStar};
				return star;
				break;
			}		
		}
	}
};

function calculerMoyenneAvis(index) {
	var totalEtoile = 0;
	for (j in restaurants[index].ratings) {				
		totalEtoile += restaurants[index].ratings[j].stars;
	}
	var moyenneAvis = (totalEtoile/restaurants[index].ratings.length).toFixed(1); // arrondit à 1 chiffre après la virgule
	if (isNaN(moyenneAvis)){
		moyenneAvis = 0;
	}
	return moyenneAvis;
};








