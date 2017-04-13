// Start big function
function getWeather() {	

$.getJSON('http://ip-api.com/json',
	
function(loc) {
	// Declare some vars
  var city = loc.city;
	var country = loc.countryCode;
	var	lat = loc.lat;
	var lon = loc.lon;
	var apiURL = 'https://api.darksky.net/forecast/edd4f443633485f2acb4dde45db59e1e/'.concat(loc.lat + ',' + loc.lon);
	
	$('#city').html(loc.city);
	$('#country').html(loc.countryCode);

// Get background photo from Unsplash
var photo = new UnsplashPhoto();

photo.all()
     .of(city)
     .fetch();
	 
var bgpic = photo.url;

document.body.style.background = 'url('+bgpic+') no-repeat center center fixed';
document.body.style.backgroundSize = 'cover';

// Get some JSON 
$.ajax({
      type: 'POST',
			dataType:'jsonp',
      url: apiURL,
      crossDomain: true,
      cache: false,
      success: function(json) {
				
			var degF = Math.round(json.currently.temperature);
			var degC = Math.round((degF - 32)*(5/9));
				
			function addZero(i) {
				if (i < 10) {
						i = "0" + i;
				}
				return i;
			}
			
			var sunUpUNIX = new Date(json.daily.data[0].sunriseTime * 1000);
			var sunUp = (sunUpUNIX.getHours() + ':' + addZero(sunUpUNIX.getMinutes()));
			
			var sunDownUNIX = new Date(json.daily.data[0].sunsetTime * 1000);
			var sunDown = (sunDownUNIX.getHours() + ':' + addZero(sunDownUNIX.getMinutes()));
				
				function placeIcon(icon) {
					var icon = json.currently.icon;
					switch (icon) {
						case 'clear-day':
							$('.icon.clear-day').removeClass('hide');
							break;
						case 'clear-night':
							$('.icon.clear-night').removeClass('hide');
							break;
						case 'rain':
							$('.icon.rain').removeClass('hide');
							break;
						case 'snow':
							$('.icon.snow').removeClass('hide');
							break;
						case 'sleet':
							$('.icon.sleet').removeClass('hide');
							break;
						case 'wind':
							$('.icon.wind').removeClass('hide');
							break;
						case 'fog':
							$('.icon.fog').removeClass('hide');
							break;
						case 'cloudy':
							$('.icon.cloudy').removeClass('hide');
							break;
						case 'partly-cloudy-day':
							$('.icon.partly-cloudy-day').removeClass('hide');
							break;
						case 'partly-cloudy-night':
							$('.icon.partly-cloudy-day').removeClass('hide');
							break;
						default:
							$('.icon.clear-day').removeClass('hide');
											} //end switch
				} //end placeIcon

				placeIcon();

			$('#tempF').html(degF);
			$('#tempC').html(degC);
			$('#sunRise').html(sunUp);
			$('#sunSet').html(sunDown);

				// 8 moon phases, lunation number 0-0.99...some approximation
				function placeMoonPhase(lunation) {
					var lunation = json.daily.data[0].moonPhase;
							if (lunation == 0) {
								$('#moonPhase').html('new moon');
							} else if (lunation >=0.01 && lunation <=0.21) {
								$('#moonPhase').html('waxing rescent');
							} else if (lunation >=0.22 && lunation <=0.34) {
								$('#moonPhase').html('first quarter');
							} else if (lunation >=0.35 && lunation <=0.47) {
								$('#moonPhase').html('waxing gibbous');
							} else if (lunation >=0.48 && lunation <=0.60) {
								$('#moonPhase').html('full moon');
							} else if (lunation >=0.61 && lunation <=0.73) {
								$('#moonPhase').html('waning gibbous');
							} else if (lunation >=0.74 && lunation <=0.86) {
								$('#moonPhase').html('last quarter');
							} else if (lunation >=0.87 && lunation <=0.99) {
								$('#moonPhase').html('waning crescent');
							} else {
								$('#moonPhase').html('not found');
							}
				} //end placeMoonPhase
				
				placeMoonPhase();
				
			} //end success
}); //end ajax DarkSky
}); //end json ip-api
}; //end getWeather

// Nav functions
$(function(){
	$('#showFah').on('click', function() {
		$('.weatherFah').show('slide', {direction: 'right'}, 1000);
		$('.weatherCel').hide('slide', {direction: 'left'}, 1000);
		$('.infoSun').hide('slide', {direction: 'left'}, 1000);
		$('.infoMoon').hide('slide', {direction: 'left'}, 1000);
	});

	$('#showCel').on('click', function() {
		$('.weatherFah').hide('slide', {direction: 'left'}, 1000);
		$('.weatherCel').show('slide', {direction: 'right'}, 1000);
		$('.infoSun').hide('slide', {direction: 'left'}, 1000);
		$('.infoMoon').hide('slide', {direction: 'left'}, 1000);
	});
		
	$('#showSun').on('click', function() {
		$('.weatherFah').hide('slide', {direction: 'left'}, 1000);
		$('.weatherCel').hide('slide', {direction: 'left'}, 1000);
		$('.infoSun').show('slide', {direction: 'right'}, 1000);
		$('.infoMoon').hide('slide', {direction: 'left'}, 1000);
	});

	$('#showMoon').on('click', function() {
		$('.weatherFah').hide('slide', {direction: 'left'}, 1000);
		$('.weatherCel').hide('slide', {direction: 'left'}, 1000);
		$('.infoSun').hide('slide', {direction: 'left'}, 1000);
		$('.infoMoon').show('slide', {direction: 'right'}, 1000);
	});
});

// Helps the tweet button
// function openURL(url){
//	window.open(url, 'Share', 'width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0'); }

$(document).ready(function() {
	// Stuff that happens when the page loads 
	getWeather();
	
	// Helps button id=tweet to load a twitter share window
	//  $('#tweet').on('click', function() {
	//	openURL('https://twitter.com/intent/tweet?text=' + encodeURIComponent('string ' + variable + ' #freecodecamp'))});
});