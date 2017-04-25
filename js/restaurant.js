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

// tableau qui contient les positions des restaurants
var locations = [];
for (i in restaurants) {
	locations[i] = { lat: restaurants[i].lat, lng: restaurants[i].long };
};
// filtre x et y pour les étoiles
var filtreX = 0;
var filtreY = 5;

var propStreetView = {
	key : "AIzaSyByBJuw5KmFoet1QtQ9xQkk_deUNQmrKyo",
	size : "300x150"	
};

genererListeRestaurants();

// Genere la liste des restaurants
function genererListeRestaurants() {
	for (i in restaurants) {
		var moyenneAvis = calculerMoyenneAvis(i);
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
							'<strong><span id="moyenneAvis'+i+'" style="color:orange; font-size:15px">'+
								moyenneAvis +
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
		for (j in restaurants[i].ratings) {				
			$('#collapse'+i).append(
				'<span style="color:orange; font-size:14px">' + restaurants[i].ratings[j].stars + '/5 '+'</span>'+
				'<span style="font-size:12px">\"'+ restaurants[i].ratings[j].comment+'\"</span><br/>'
			);
		}	
	}
};


$('.btnAjouterAvis').on('click', function(){
	var id = $(this).attr('id').replace('btnAjouterAvis','');
	$('#ajouterNouveauAvis'+id).toggle(500);
});

$('.star').on('mouseenter', function(){
	var star = idEtoile($(this).attr('id'));
	for (var n=1 ; n <= star.numStar; n++){
		$('#star'+n+'_'+star.i).css('color', 'orange');
	}	
});
$('.star').on('mouseleave', function(){
		$('.star').css('color', 'grey');
});

$('.star').on('click', function(){
	var star = idEtoile($(this).attr('id'));
	// remise à zero de toutes les anciennes étoiles cliqués (notées)
	for (var n=1 ; n <= 5; n++){
		$('#star'+n+'_'+star.i).removeClass('note').addClass('star');
	}	
	// nouvelle note
	for (var n=1 ; n <= star.numStar; n++){
		$('#star'+n+'_'+star.i).removeClass('star').addClass('note');
	}
	// une note est attribuée
	$('#note'+star.i).text(star.numStar);
});

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
	return (totalEtoile/restaurants[index].ratings.length).toFixed(1); // arrondit à 1 chiffre après la virgule
};

$('.validerNouveauAvis').on('click', function(){
	var id = $(this).attr('id').replace('btnValiderNouveauAvis','');
	var n = restaurants[id].ratings.length;
	var note = parseInt($('#note'+id).text());
	// contrôle qu'une note a été attribuée et qu'un commentaire est renseigné
	if($('#nouveauAvis'+id).val() == '' || note == 0) {
		$('#alert'+id).removeClass().addClass('alert alert-danger')
			.text('le champ commentaire est vide ou aucune note est attribuée')
			.show(500).delay(3000).hide(500);
	} else {
		restaurants[id].ratings[n] = { "stars":note, "comment": $('#nouveauAvis'+id).val() };
		$('#collapse'+id).append(
				'<span style="color:orange; font-size:14px">' + restaurants[id].ratings[n].stars + '/5 '+'</span>'+
				'<span style="font-size:12px">\"'+ restaurants[id].ratings[n].comment+'\"</span><br/>'
		);
		//TODO mettre à jour la moyenne des avis et le nombre d'avis
		$('#moyenneAvis'+id).text(calculerMoyenneAvis(id));
		$('#nbAvis'+id).text(restaurants[id].ratings.length + " avis");
		
		$('#alert'+id).removeClass().addClass('alert alert-success')
			.text('nouvel avis enregistré avec succès')
			.show(500).delay(3000).hide(500);
		
		//TODO réinitialiser les valeurs par défaut du formulaire et le cacher
		//$('#ajouterNouveauAvis'+id).toggle(500);
		$('#nouveauAvis'+id).val('');
		// remise à zero de toutes les anciennes étoiles cliqués (notées)
		for (var j=1 ; j <= 5; j++){
			$('#star'+j+'_'+id).removeClass('note').addClass('star').css('color', 'grey');
		}	
	}
});






