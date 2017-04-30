/**
 * Yelp
 */ 
var auth = {
	consumerKey : "6bYY1U8dhgFt17noBW5NXQ",
	consumerSecret : "LXEV5iVj-Azb12ub7G8kaFWpK5Q",
	accessToken : "tX6UzxaDaewFyriSB902mFFs4EDUF6Lx",
	accessTokenSecret : "YpjvnyGiU5JRb6RaPrl0LmmVTjg",
	serviceProvider : {
		signatureMethod : "HMAC-SHA1"
	}
};

var accessor = {
	consumerSecret : auth.consumerSecret,
	tokenSecret : auth.accessTokenSecret
};

// remplace les caractères avec accent par les mêmes caractères sans accent 
function remplacerAccent(chaine){
	var accent = {
		a: [ 'à', 'ä', 'â' ],
		e: [ 'é', 'è', 'ê', 'ë' ],
		o: [ 'ö', 'ô' ],
		u: [ 'ù', 'ü', 'û'],
		c: [ 'ç' ]
	};
	var sansAccent = {
		a: 'a',
		e: 'e',
		o: 'o',
		u: 'u',
		c: 'c'
	};
	for (lettre in accent){
		for(i in accent[lettre]){
			chaine = chaine.replace(accent[lettre][i],sansAccent[lettre]);
		}
	}
	return chaine;
};

// yelp Business pour les Avis
function yelpBusiness(idRestaurant, index) {
	
	var parameters = [];
	parameters.push([ 'callback', 'cb' ]);
	parameters.push([ 'oauth_consumer_key', auth.consumerKey ]);
	parameters.push([ 'oauth_consumer_secret', auth.consumerSecret ]);
	parameters.push([ 'oauth_token', auth.accessToken ]);
	parameters.push([ 'oauth_signature_method', 'HMAC-SHA1' ]);

	var message = {
		'action' : 'https://api.yelp.com/v2/business/' + idRestaurant,
		'method' : 'GET',
		'parameters' : parameters
	};

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);

	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth
			.percentEncode(parameterMap.oauth_signature)
//	console.log(parameterMap);

	$.ajax({
		'url' : message.action,
		'data' : parameterMap,
		'cache' : true,
		'dataType' : 'jsonp',
		'jsonpCallback' : 'cb',
		'success' : function(data, textStats, XMLHttpRequest) {    			
			console.log(data);   	
			
			var avis = '';
			for (j in data.reviews) {				
				avis +=	'<img src="img/Yelp-logo.png" width=36 height=20> '+
					'<span style="color:orange; font-size:14px">' + data.reviews[j].rating + '/5 '+'</span>'+
					'<span style="font-size:12px">\"'+ data.reviews[j].excerpt+'\"</span><br/>';
			}
			$('#collapse'+index+ ' div').html(avis);
			
//			for (i in data.reviews) {
//    			restaurants[index].ratings[i] = {
//    				"stars":data.reviews[i].rating,
//    				"comment":data.reviews[i].excerpt
//    			};   			
//			}
//			alert(
//				'index = ' +index + '\n'+
//				'restaurants[index].restaurantName = ' + restaurants[index].restaurantName + '\n'+
//				'restaurants[index].ratings[0].comment = ' + restaurants[index].ratings[0].comment
//			);
//			genererAvisRestaurant(restaurants[index], index); // ajout des avis du restaurant
		}
	});
}; 

