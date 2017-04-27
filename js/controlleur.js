/**
 * Projet 7 : Lancez votre propre site d'avis de restaurants
 * @link : https://openclassrooms.com/projects/lancez-votre-propre-site-d-avis-de-restaurants
 * @author : Thierry Raimond
 * 
 */

// génére la liste des restaurants à gauche de la carte
genererListeRestaurants();



$(function() {
	
	/** quand on actualise la page pour éviter certains bugs d'affichage */
	// Les premières valeurs des listes déroulantes sont utilisées par défaut 
	$("#filtreX, #filtreY").prop("selectedIndex", 0);
    
	// initialise googleMap
	initMap();
	
	/****************************************************************
	 ***************** GESTION DES EVENEMENTS ***********************
	 ****************************************************************/

	$('#listeRestaurants').on('click', '.btnAjouterAvis', function(){
		var id = $(this).attr('id').replace('btnAjouterAvis','');
		$('#ajouterNouveauAvis'+id).toggle(500);
	});

	$('#listeRestaurants').on('mouseenter', '.star', function(){
		var star = idEtoile($(this).attr('id'));
		for (var n=1 ; n <= star.numStar; n++){
			$('#star'+n+'_'+star.i).css('color', 'orange');
		}	
	});
	$('#listeRestaurants').on('mouseleave', '.star', function(){
			$('.star').css('color', 'grey');
	});

	$('#listeRestaurants').on('click', '.star', function(){
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
	
	$('#listeRestaurants').on('click', '.validerNouveauAvis', function(){
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
			// mettre à jour la moyenne des avis et le nombre d'avis
			$('#moyenneAvis'+id).text(calculerMoyenneAvis(id));
			$('#textMoyenneAvis'+id).text(calculerMoyenneAvis(id));
			$('#nbAvis'+id).text(restaurants[id].ratings.length + " avis");
			
			$('#alert'+id).removeClass().addClass('alert alert-success')
				.text('nouvel avis enregistré avec succès')
				.show(500).delay(3000).hide(500);
			
			// réinitialiser les valeurs par défaut du formulaire et le cacher
			$('#nouveauAvis'+id).val('');
			// remise à zero de toutes les anciennes étoiles cliqués (notées)
			for (var j=1 ; j <= 5; j++){
				$('#star'+j+'_'+id).removeClass('note').addClass('star').css('color', 'grey');
			}	
		}
	});
	
});

