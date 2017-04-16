// Start big function
function getWeather() {	

$.getJSON('http://ip-api.com/json',
	
function(loc) {
	// Declare some vars
	var city = loc.city;
	var country = loc.countryCode;
	var countryLong = loc.country;
	var	lat = loc.lat;
	var lon = loc.lon;
	var apiURL = 'https://api.darksky.net/forecast/edd4f443633485f2acb4dde45db59e1e/'.concat(loc.lat + ',' + loc.lon);

	$('#city').html(loc.city);
	$('#country').html(loc.countryCode);

// Get background photo of city from Unsplash
if (city == 'Central District') {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "https://source.unsplash.com/all/random?"+countryLong, true);
		xhr.send();

		xhr.onreadystatechange = processRequest;

		function processRequest() {
			var photoURL = xhr.responseURL;
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.body.style.background = 'url('+photoURL+') no-repeat center center fixed';
				document.body.style.backgroundSize = 'cover';
			}
		}
	} else {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "https://source.unsplash.com/all/random?"+city, true);
		xhr.send();

		xhr.onreadystatechange = processRequest;

		function processRequest() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var photoURL = xhr.responseURL;

				var notFound = 'photo-1446704477871-62a4972035cd'
				if (photoURL.includes(notFound)) {
					document.body.style.background = 'url(https://source.unsplash.com/random?nature) no-repeat center center fixed';
					document.body.style.backgroundSize = 'cover';
				} else {
					document.body.style.background = 'url('+photoURL+') no-repeat center center fixed';
					document.body.style.backgroundSize = 'cover';
				}
			}
		}
}

// TODO fade in 

// Get some weather info from DarkSky 
$.ajax({
		type: 'POST',
		dataType:'jsonp',
		url: apiURL,
		crossDomain: true,
		cache: false,
		success: function(json) {
				
			var degF = Math.round(json.currently.temperature);
			var degC = Math.round((degF - 32)*(5/9));
			var degFHigh = Math.round(json.daily.data[0].temperatureMax);
			var degFLow = Math.round(json.daily.data[0].temperatureMin);
			var degCHigh = Math.round((degFHigh - 32)*(5/9));
			var degCLow = Math.round((degFLow - 32)*(5/9));

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

// Get user's current time
var currentTime = new Date()
var time = currentTime.getHours()
if (time >= sunUpUNIX.getHours() && time <= sunDownUNIX.getHours()) {
	var day = true;
}

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
							if (day == true) {
								$('.icon.fog-day').removeClass('hide');
							} else {
								$('.icon.fog-night').removeClass('hide');
							}
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
			$('#tempFLow').html(degFLow);
			$('#tempCLow').html(degCLow);
			$('#tempFHigh').html(degFHigh);
			$('#tempCHigh').html(degCHigh);
			$('#sunRise').html(sunUp);
			$('#sunSet').html(sunDown);

			function loadTemp() {
				if (country == 'US') {
					$('.weatherFah').show('slide', {direction: 'right'}, 1000);
				} else {
					$('.weatherCel').show('slide', {direction: 'right'}, 1000);
				}
			}
			loadTemp();

				// 8 moon phases, lunation number 0-0.99...some approximation
				function placeMoonPhase(lunation) {
					var lunation = json.daily.data[0].moonPhase;
							if (lunation == 0) {
								$('#moonPhase').html('New Moon');
								$('#moonIcon').html('<img class="icon icons8-New-Moon-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAADiUlEQVR4nO2d0XWjMBBFbwkqQSWkg6UEd2A6sTrIdhA6iDswHdgdQAd2B9kP4Rw2wUZgQAOad879yrHzmIc0CNkY5MsAf4A9cAA+gVNDBXz9oGr9/bN5zb55D7Ow903I4gv4QXfBX6Vq3nvf/C9VhyzwDpyZPoA+zvhRZGc+RvEy+LM0RgjPwtmT2NRm8aPhSvwAHnElgVFj8XN37GIP5YONBWPwZ1vswr7KgQ1MZTvmuVKKRdUc0+pk8OuA2AWcixMrGi07ZDfsqbgC2TQlm0/vxC/U0hwmqdzEMshaTyzNGUFTmCXtMESF8kYa/SKUa1OTKNIwBIWiYQgKxaJhhIYye09J/WpqKLM3eg1jOKdRlQ7QXwEHt1bc8HI/107AQa2dbGjRH8miTXwKJmvyJwEHsxVOA2v/SzpVTc/o/RTDtjaXpFAxcupyAsxvFRecQiMrwPTWsYFZAFAIMLx1isAsdHQsiA0JRFfky+H6wjDoInBJeheLuQCTqZE/C0Tv5i7P+VEYVoC5VLFdgWgzj4frCqQSYCxVfk1bVoCp1LHtQHIBhlInbwdSCDCUOkU7kEqAodSp7mEYAWYUD+A332MbUTwZaEOXRA66MygJB1AKMKJ4jhqILEoNRBYl6BpEEhUCTCj/E92AooGIJroB5UcgtQATiqcGveyVRKmByEIDEcYR9OaiJBzo7XdJ5KAbVJLIQLdwJfGtWoCZ1KnbgRQCDKVO0Q4kF2AodfJ2IFaAodT59cWdiwBTqXL5GQbo1xFi4roCsQKMpYrtCgR02opB53R1Vy7AYGrkzwIxwE2AyVS4EfAgGm3uy+H6wgBt7ktiQwIBvZWyBEVgFoCOkiWwgVl8ywkwvVVccAotGfS2/BzUvPB0Un0I5vS8/KNipYCD2ArloMo/kC4WpyFoERiqTMABrZ1sYM17pSv48bjh5Q6T3g0eTjmm0KEyaChDuLDAr+xYtMmHMGkT79MbGkpfGFF+qU1DERLGXRqKoDDusmij/2KhBh6q1K++SgSF0ZYjfnGWxk1Qt1mVkUZfubGCH7i/y7Dtu8QlQqeoPu3Y1iZXzQT7GbFl2EZvcax0VDySZZ2fZikY8YGENcnizzbJjf/WeLQzHL9YGfznWiWtXy6Np01NTWNk8WdkjHAuJDgahsjiz9KCea7Q6ua9czSE0crwBXT454GUDTXdBb///di8Jmcli7h/MgGDY06YzWQAAAAASUVORK5CYII=" width="100" height="100">');
							} else if (lunation >=0.01 && lunation <=0.21) {
								$('#moonPhase').html('Waxing Crescent');
								$('#moonIcon').html('<img class="icon icons8-Waxing-Crescent-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFi0lEQVR4nO1d7ZWrIBScEiyBEtLBo4R0EEp4HYQSXgdrB5sOYgebDrSDbAf7fqjnuOSCQFC+nHPmlzDxzg0gqAjkgT8ALgCuAD4B3Cf2AH4U9ovjn1Ody6TR7H3iJaDBaOAHgC+8Gv4u+0n7AoDtE1J+YBj/yVskYI1f02+zjWNMHnNLuGP/JJiSc0FlXRvD2GU8ET8BOj5RQathGBMR2+yZg2W5DxSWmAbjvy12AqhWwAEIADeL8lcU0JWdQV+apsIngNN0rgyABPBtKN9PMWUHhnEOENtw26Qw5fwFzF3aHRm1ljPSHrApfoE2WECfmLnLSxpXxDfXl/80MTUYuzJdvauXUxujQVrzCV+axgcGoNPU07WwKGCIM8PegtR4ouKvpm4SSTkhv/FijXfLuAei7vKqbXeUmIyZ3CL+BsCDqBslKSUn4wfjfMMWLVF/16Q0KDsZM4WDJy1R/4kdxpQG5QzgNq3ExdCW0Nh8oK8lGTP/OvrTEhp3Rw1r/CN+rHT2Hj61hI700DGCEz9SC30WE6mrL+6hQ6KWQVzHm6dng6ITbJC/a060JjIP306Ezt1D5xfODiddMnULj2uQhJb3/ZQGad9c2pO9r4l4XZDs4dl1Sc+TL5W+M29GaMkQIrXT2cQFJKHHXATawMGUwC8XAxVQV12tbWW2Q3C5ktmaSED46smdg8yJrkspKgZFT65VqH0SuEafSeISQtFbnSzqbk8eHNmbzLPEoGgKU+HaVnN9+O7yh1T0tBcLLIFgcyA3mG0DRmgyqqBMINgcKI1220F9lpjU7BMINgd2a25bQCiaL90WSyDQXPi0MHwNDaHLlgVEAoHmxBBQb2KJ5cE2gSBzYohHfKSi2S4P9gkEmRO5leVmcEWznw9Q/dlBM99dQpmh6gKo+wEGX0p7z41QxxEOHAO6D99d05rRKroCOCaEPuwcTDdBKroSsHsD9eA2CRGK7g3QvxV0cPuEcEq3SyDA3Ng5mG4Cp3T7BALMkSGgTjl6JBBYrgyFF93YgeXKUDgSEoihcCQkEEPhRXdIILgcGQLqoD4Ax2WvDzsX1w3glG6XQIC5sXMw3QRO6XYJBJgbOwfTTRCK7g04FhdjJkQquhI4lt99uOnyO08gwNwoHUw3QX1SlAPHLVwfbnoLFzjmIq7kloabwBXNYXmwTSDInLj5Y0AigSBzYgio44dYHmQJBJkLvy0NN4Eat19ecxgSCDYHdhaGr0Eomg+qkEwg2BwoV8y2gdXrCCyBYHMgXzF7DYzQZLrC1LZCB38z9CttZHc143jp08zBZJ4lekVTmAo3MH8doHaGfi36GxYtTkYKNge+u2TSK3rSphLbMcDcyGwM1EC8o9duHFiONA6+K6D2HmtdBNhGQeVM6WKgAknosRAiNTPqBmYAvcdTrRx8DJxwJ7S85zLHJpgjk9gEc0anOcmayDx8o7aJ7Tx0XlD7ZNF3I+Ve0bGaBNqCI44ZKdCni6G2ueIeOkbUuBn/4OHTB6EjPXSsUNtqsOtSCZWMzlHDCbrvLpXIAW59PpWMh6OGF2oZ5IWDJ1Qygg7iazih7KQMDl7okhHlS22lJoVbxK/7HleUZMwoMSmdZdw9UTdqMmYwlDPQ2/T7V03dXQZwWzQoY4nFNAk8Qf+1oQ4JJWMJifim+tL0+W5dq/jBhpO+UDgjv3FF191coN965BsZfOB+RoN8tn2ixg1TIn6QcBe1hjPSvsm1vCpiGLsm09chBgS4nxEbDcZ+NrVubO5yLgA+LcpLZNoqdGBI62mW3rJci/ce/0keDGOQqbUYtfVIFJ4IFQ3GBbwO8RMw8zGdU1Fdkw8Yxn9kjBn/AxW2BhfMLafFNgkaJm2BIwne4BgNlBjnN93EAbTh8/HbVEcgk0ncf+rwysM0Hj/rAAAAAElFTkSuQmCC" width="100" height="100">');
							} else if (lunation >=0.22 && lunation <=0.34) {
								$('#moonPhase').html('First Quarter');
								$('#moonIcon').html('<img class="icon icons8-First-Quarter-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFDElEQVR4nO2d23WkOhBFdwiEoBCcgQnBGbQyuDcDK4OZDEwGdgZNBnYGdAZ2BjMfgjWtRvQTqCrgrFU/BqTTtZGEwAjQrwJ4BnbAK/AO7NtogD8n0Rxtf2+P2bVlFDN7X4QcMYFv5BP+aDRt2bu2rk0ZOeAX8Mn4AC7FJ7EVuYl/o3oVxLNUAsI5ODtW1rU5Ymv4ZpqkFkDZhgcC8AF83VDGNytoNY7Yd099ll9SSYR0LaA3FgamIJ5tc3U7t3rzxBZ0qdxXFtCVvTDNldJYQI7liC3ncKbspv1N5lQQ5wFzgngUyLE858HsMdRaXphuwJ4LSCfPMJhv4nikWr+QAzEFkE7hTH2vE9X5kAr0zCem0hNQD9T5iaIuzKEHxpRAOv0/UK8KKE/IjhcSQCD+7p9M3d/tNhFphDEXEIitoc7ULwJFK4w5gXSqMh5mheLQC0MCCAxDmXxM0XQ1pQkI5KFMPtBrhyEJBOA3fT/7OSvTGNKq6HsKY1fykqlEa2hQ7tZ+OVbhDt2DuEYgBf17YKMN8ntkEmsZCMTL3lNv+0cLtdRVaQMC+ZuSdz9PKZj/4dLSgEB/Nt9wZ9cVkEno0oA4+h7DGIVYCY0K9H26WwqoMgVYCY3KXXVV1x7skEnkkoFAfBx8VyuxMiO3BgT6rSRcOqDA1iTQGhBP6vXiZPH0AIuhXadPGv25nS3czbUOJJD6/Rza0SGTwLUBcfQ9u9yO1gdzK0CgP3sPuZ0aZBK4RiCe1HOv23LIJG+tQAr6vt3xDj6zg9WwoprUtz/eWCGTvDUDCaS+q+ONDTLJWzOQktR3023I9WeWw5Ky3svMBsthSTWp9xKWNaBbA3L6bqMHu08GlwAkkHoPMPwSitWwJE/q/QM2IJIqSb3XsAGRVEkGSINM4jYg/VtWDcgkbQPyTz3/0gncgGxAVGkDokw9/4fMHy2HJTlS7wfYLnslVZJ6r2EDIqmSDYgqeVLvH7DdXJRUIPUeYLv9Lqns7fcSmcRtQAYeUG2PcOU06P2Q2Wg1rKgk9X043lghk7w1AwmkvqvjjR6Z5K0ZSE3q2x9vdMgkb61AcuN278WdW9ZG1xwW5Ek9f+V22l5HmE97Us8ht5NDJoFrA+Loe3ZDOy+h29KuQOo321118sgkcU1ATt9y9ud2LsivR2spNMuTev3hioVorA/umtWQeg3XHOSQSeTSgXj6Xt21B1eZg62ERuXWHqtuKcAhk8ylAgk80DrOFWIhtMnR9xjuKSi3xpOF0KY9qb8DD6xOui2C+ZgCfX8Pf1SszhSqObQot0xsPUbB1iaLGpS7qrpqEnitSmSSaxVIbpmrcuxKrMzgpfVG31OYqjILd4MllTtp6ykrLNAPRUq5lvHFDF/Zcege5CWUgzHqIH5JQ5+N0xBzawiGyJfaNEKZS0Pf4xKB0UkjlDk09NlAURidHLoG+qn130C9swzg10rT1ddUemJ4XeMaRTCOFVgmkNcz9YWJ6hxNJbLjypjaMbz0yA8GPnDfaejDvVaAnAOhuou6pBfmf8h1rxyxazr3dYgDIzzPkFbBvGPLrd52wPsV5QaMtoohOeb5b5ZLeia2hGu/BFFxxz8kWJIjnm1TDfwFMenPxLP/ldgCmhvK+Gk9ugl+v1oVxH8e0zJ/+dN68Sysa7pHjnhGSsD5YoWt4RY54llaMc0V2qEt27NBuFslMYGBuPpB3caBfMK77R/tMR4jk7i/M2JRaPMzUYoAAAAASUVORK5CYII=" width="100" height="100">');
							} else if (lunation >=0.35 && lunation <=0.47) {
								$('#moonPhase').html('Waxing Gibbous');
								$('#moonIcon').html('<img class="icon icons8-Waxing-Gibbous-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFf0lEQVR4nO2d23mrOhBGVwmUoBLSQSghHZgOTjoIHezdQegg7sB0kHQAHSQd+DwIZ3MRtjGaERet75sXg4VmfjTDVcDySYBn4AC8AR/AqbEKOPesai3/aP5zaNpIlPu+CQw2gO+4Az7XqqbtQ7OtiAMD/AE+8S/ALfvEjiIj7OPiSbB7aQgRrolzYGepzWBHwzfzgvcFZEDqaD9tLANy4Nisf2/b3+xg1Bhs7p67F9cMRZhCihWpvHN772xMmAS7t/lIKYVA3zLuE+eNDaSyF/wdKf0V7qsBXrEjcKwPVePT6kiw5wG+im2h2ns7auor/TmxotHywvyC3bajbvc7ZIwL8828WqbCH/wJccYGI/SemGAPAq7VlsWRIHM+kSr6cAvDePH/JPyO84tBRoxCz4VJvLJgUZ7wWy8u9sMCnLvCE+7a8t0sC9YpCTHO2Jy9dBLcKSyIKJJiLH109CkILIpBToy1jI4+BW5RxHcsqaOptY6ONjkBCr30pfJCsvMKFAx9Oklt7K9jY74t2BGKRwoU0vCLYyO+7ct3pwNSMvQv9dW4QbaIX+zVV4cXQMLwPMVbkT8hL8aZjd0EwqZf7/VEI1VtLV21cV1mefh+SoLMYzhbT1d9Srq+VjyYunJ0xDizjaOrMQxDf3MfjUjZz2QX10fOzJpZOBqQspB3BLVwHXUV9/7ZoCfG1utHm4wHR4nGGfle6kefmom1JEHnJLBteyKj6/vNk8X+H6St9OHlyqjpxiC7trL2g8/SD78tkf7J4ufYigZdMc7sp6C3MQzjYFwrahfzM8t6zEeTkm4cctdKFfqCrPXu4FwybqQtg74YezhDHyPhRtrKHCtIWyng6Joo6cYjay8siIJok9ONR9FeGKJ+5BJeroiUbjyqywJXPouC6NCPCTBUSssyMTfXQ/9F1BTCFPTfje+cI46dNCcKEoocRxoviYKEIqMbkyOEEyQyrN8lREFCkuIQpCIKEgpDNyYVhBEjCvKPQVyiIGGJgiyMKMjCGMSldvwYBdHB0I1JDfGwNyQp3ZiUEAUJScqCBEnl/FwNGd2YHCFeXAxJTjcmOcTL7yFxXn5PCSNIJujoWug/KZpCvIUbkn5MfqkdC6MgsqR041G3FxboC1IKOLkmcrrxKNoLM6Ig2pR045G1Fxr0BfmW8HIluOr24DnnKXOj+7L4sLU158QJ8XUEPU5045C7VjLoCxJf2LFmxlbWTlvxlbYb87xk6ApS+vFxVVR0Y5BdWznBvkijKcqeyOj6ftcck3HiADn6oyO/508GXUH2Utgzhr6be/9cOP4sZXuZfKY/OoopDRj0BNnDGXvOjNFxrZFYR6ZjGPqbP9KQa46nWEemc6Lra82MS0Zak2COzvexcrxOgnmhdDQqYWZuRxeGa5rY0kfDWieLW0pbrqMqrx8aSJEXZEtpq183zghc2Y6T8d/HO0O/cqmNSV8NLqQ6roRLjFJygwmyoqh8lUaIN4b+fKHgj0G2yOfSDgjgGhmqXwt6Qk6UtY2SMTGCfKlNSpRcz42HGfsAcxAxLkiJsvRR8oT7dfKgYlwwyBT6Qs+FSfyHu78qBfxepI6+UkUfbmEY/9pQyYLEaJPjV5CK8I4muA9pV1PvUvzWlQ/V3nc5MD71yA/LGsFXGftw76P2rtr760IsOkXd4gV/N7n+CPfVYAv2NSFqPNzPCE2Cv9rie6Qk2NEwVqz7tWKVo2IMg5+nWSrm5e5nbJG+R4Rz02czY3uLx2D3trmF/xObYp4d7T83dsAG/4Npn+L4afpovHm9AhLsw2Mh3ksZs6+mT5tKTY9gsHtkCHG+2OFomILB7qUFMo8h1U3bGVGEh0mxAcyxj56WjdW4A35Zfmz+k7GSk7j/AaLBA264+bU1AAAAAElFTkSuQmCC" width="100" height="100">');
							} else if (lunation >=0.48 && lunation <=0.60) {
								$('#moonPhase').html('Full Moon');
								$('#moonIcon').html('<img class="icon icons8-Full-Moon-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFfklEQVR4nO2d3ZXjKBBGbwgKgRA6g1EIzsBkMJ3BKIOZDKwMujOwMmhnYGXQzsD7gLzHO2urCiQhhLnn8GR+PlUBBeoWQPpUwA9gD/wCPoDjkM7A9a90vvv9YyizH+qoImvPAoMz4IHHBp+azkPd+6GtwgMM8Bv4Yn4HSOkLN4rMws+YPBWul67hhDHn7Hmxqc3gRsM36zvgWfrmBUaNwc3daxvbNx3IzDEVrretbdip6RcZTGU7llkprZXOwzNtjgq3D5jLED3QAQ3wDtRDMg/aNne/vw9luqGOufQc2dBo2TE9YPdAC1jmnb/NUGfLdAd945yeNL8Jf8ALzlB1RL310OZlgu5fEfWqqQjfT/S4Xrs2lvBRk9QUZghzRkcajvgbi9Pm+zxfJOCUN/zjRc82Vio7/EfMN84mqxDijD8k0Is8qHCak3eKrzNOa4ickTf8RktUpxj8nNGyrVHxjAr4xM8piz+372rKLi1oBSwJBXqtMy5sI3CHskO/dzkuJUIb3C5sO15oeUPvlGbuxmtlw6/ijBs+TqnnarRCF8RfzRk3tE6ZLcgfFY1dyTtmSOyIFE+0DdmpDWWAZeGOW6H741Ib2kCGaPYpZwKnrkZR+Sm08kyp0O3oG9+KjaLSK68ZxCXe0NnO+FTaKipspmvPFs2erdVWZhSV9ZSpagzt1GU0lWm8+8pLXC2aFWojVaLZBHZzK8+YjnFbiptFK1Rwpew5fLBMtKf0NrdfQnXm9Izb9OtZQSMULKMjDEtgcJeC+WVR2XkjvXxsHhWSpqt2Wc1Z0+I5bRmhwJUN/NtkwtTI9v3PassKmfsYqjOnxyM+t0LmNobizGnxsPFZyGyjSM4by7iNz7eMlZDx6bKs4IVBtjMgB5w+muT86VEsnKyQqYupOHM6FKGhETI1MRVnToPC1p2QycZUnDnvjNv6E2SH1HE1Z02NIjx0QqY6puLMqVE4RNqDmKiS88ag2Iuo1saF2RDtXRwSl+KQxCgOSQzR3r2QwUQWnDOGcVv3UJa9Makp+5CkqJnBITam4sxRvTpphExNXM1Z06CwtRUydTEVZ06HYjaqhUznqJLz5owiXpc/4cbB4LHn64WMNorkvLEo9iA3WiFzG0Nx5rR42NgKmUscmY4UP+x9ZiNk/jfgFIKoke37vw93TkKBdnHZ+dIybtvTo0LS5wjfC4vOGekzweZRISMUKqutMCwTthXStFWCuz9SMH84Xd2wQuEr5ZNoHywTZ50K+fOr4xLKM+XIuC0vKA5gKAcHzMMsBweALrifKUdrjKE9hc9oK2wVlf2ZSXyOzHr4DJTjmaawyPFMoDvALIkbARJCewpfE1p5r6j8EK4/Oz6Q7dUzoROXQzD1WHS2mrxC7WI1tGG0HbebozHNZvHKypeZrIj26g7VJlBLrWjwFZ3ic49KPXfj2sP4X8UpPs5olhIhvQ2+d0rOMcXnrsZuSSEVeqfkuvqy6J8/ykHTBr+LGA8xREWgQrfPWCSIS/jcm3HF7V63HFfe8LtkeZWrO3ydcsVdzbql0VLhf53sqveohDjlzDYC/g7/q8eTuNTGN9Df0hHYr6BXYk/Y1eNJ3RRREXZ/7G3EpOCYPf4j4pY6EnLGPQ1hD3TFresPxL+++8C0+9+biHqDqJl2P/lt1BxwvdbMqM0MdR4IHw338aKeUduiTJnCnjnoiLtM/ifwY0jmQdvm7vefQ5kj0x2wiSlKYkf4pfEppp5trBBHqZgWW1JJDRsdFc8w6P6bJbXUkvknfQbX26YG/iXTZdBoFnj+ZKlwb05DNpVLpdOgKaupKQSD65FrOOfEC44GHwyul7Yss0Lrh7otxQnB1DgDNrjzQLoh9Tw2+O33z6GMZSObuH8AToH1q9xlRIEAAAAASUVORK5CYII=" width="100" height="100">');
							} else if (lunation >=0.61 && lunation <=0.73) {
								$('#moonPhase').html('Waning Gibbous');
								$('#moonIcon').html('<img class="icon icons8-Waning-Gibbous-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFjklEQVR4nO2d3XWsIBRGdwmWQAnpIJSQDkIHNx2EDnI7iB1kOhg6SDrQDpIO5j6gd81CNI7yI457rfMyKpzjJxzQEWH7VMAj8Ay8Ah/AubMGuDjWXG3/6I557sqoEvu+CwT2BL7jP+FrrenKfu7qOvAggDfgk/AC/Gaf2FYkIse4eSrsVZpDhClxnrmzrk1gW8M380+UAU6ABhQgOxNO2RJ4Ab5uKNtn39xBqxHYvnuuABp7gpcigXZmfVP2zs6EqbBX2xwRFOG7i3pG3XPsNYJvyXlieqTUYrsYEdmPvxM+3GJNF1NxVNh5wJQQKrFP9YQ/t9qZglrLE+MJuyW9ENecCCfKN+tyXBLeGA9Ak/+qqgiT6N3csjkqxucThm2NUiRhBblgY899sf1HMC7GSz63JqnZqSgP+PNF223bKhXwQ3hRvskY95gYhg1cKTPQhBckmyhjYtSpHVlBrFaSXBRB+WL0aOII0osSvacYG03p2BVHImYrSZLofWLUMStMQE08QS7YWX0UfPeD6liVJeSBuIJE6UGePJWY0JVkZO3zkzkmQzkrGCbxljKGtnN5Ib4gwZL82VP4lid9SxDEFyRIPvF1VVu9HbKWFN3WhRXPUyqGD5fM0sIKIEW3dcGe00Vdl/YUJpYUVAgpRlu96VudEyEKKZCYk8RVF3ftHNyyr1HVGCGfKP5m9VynhOdgtTjEskiVR25qJe6MvF0XY1GkzCOz0kDFcBKoVodZFikF+XWyqJwD2jAxFoUhrShqyhn3bu5eJ4FThPpT3Vz7HHNEeHYWwcIsh9SJffQ8u1eGCRpmOUjSC6J9jjTOTipklAVRkV6QQbclPDvdw0RwjNSCDLot5Ww0MaIsCEN6QdS1A7WzUUcIsiQM6QWprx1w84eMEWVBaNIL0vSV+5LYvaPJk0eA4TDPxIqyIBR5BJG+yk8RAy0FSR5BFAybp44XZzFI8giiYTiiKPKlxsBI8ghygqEgMmKgpZBjtn6hy9+GQxAf2QRpnB9F1DDLIYcgja/iA0sOQS6+ig8shyAb4xBkY2QTpHV+EFHDLIccYrRwDHvHyCGIgUMQH5uaGKqIgZaCJI8gJzhuLvqQ5BFEw3H73YckjyDKV7mJF2cxKPIIIuF4hOtDk0eQ/7TOBhkjyoLQpBejvXagdjbqCEGWhCG9IPW1A8rZaCIEWRKG9IKoaweEZ4fjr6RpbXC+3RfnVfg4iyDHLP3L54j7OsI5cKClIEkviPY5Ijw7inBxFsNmXtiBYbd1vNKWqbvqUc7OTaAgS8KQVhA15YxvDcLJA3ZISjF+mDGadZvsPbWSzS0cAMfSGikFEXMdq50DG+5jorjJxWfgfpdnuuVDZclaR48OUUhBbHoBM/B//OS8pKBCSJU/WlZ0//e0CGaqD1yufv/GeAo9loldZiaEs77JYsO+Rl0puqtZk8C5SE8Fe8onKborGdpp302399CVZKDIxfh7fKs/ly5KTQF5Y4wKvyivMSuNiG+NyZD2RYJcK/AvOFxiS9HEEyNoEv+NB8oXJWbr+CHTl9p8opwpY0is2ZEYPWOiNDmdmkGs1pFVjB7B+Lc3/uRza5KaQhP4XMZGX30XJrJ5NkQSXgzDhsS4RjPu9Cv5nfZ9pGat6ZQBLEEy/h2OBnjO5hl8jPi1NF/IpN6voGL67zQ5hHmf8Gc3XdRvPDF8yOUK84f4OeZtwodbrGUH64lVzBvzn7GtJvSVF6pl6Ai+ZUUwf7h5xg4CHlfUJwmTwGu2NUoMjsBebbd8gOsTm5Bfsa3osTPhlP2I7QLXPt/46Xx0y981FfYPeKk+6DjHvjqfdtU1LUFgr8gc4nxxh63hFgT2Kq2ZHqEttbYrW3GIsBiJPYEa+3dP01mL/4T320/dMYpCJnH/ABgEA34d8zv4AAAAAElFTkSuQmCC" width="100" height="100">');
							} else if (lunation >=0.74 && lunation <=0.86) {
								$('#moonPhase').html('Last Quarter');
								$('#moonIcon').html('<img class="icon icons8-Last-Quarter-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFdklEQVR4nO1d7XWrOBScEihBJaSDUEI6MB3sdmB18F4HoYO4A9NB3AF0kHTg/SHYwxEC6+PqXjnRnDN/DEjMDJIQGADKRwPgFcAJwBnAB4DrzBHA3eK4Wv4xb3Oay2iY9/1HQMEY+A634akc57JPc10VDigAfwB8gj6AR/yEaUUqs8bi0cAcpRIhHIVzwi/r2hRMa/iCv1E3ABcAGkAHoJ3ZBJQRwi/8glajYPpu3wA0jOmPkLvVvOOHBdPAHG2PhF9gjv7Q7oKrOztH7FtxeMPxmdIE0xJUQh1cgdxnLW8J+yqGBmYecBRER1QXZyALr3ii1vKG/QF7Al0QCyQCuc8aW2It5PiDfQE6U51SgSw8Z9KVhAb784kBwEvGuqUDucNoL6YLU9gP41+G+qXDKCqUF7jHi2/kbRVrSAex5hf4dG+wF8YA3iNFOoQiQtkLo+feEcc+lEDWUBTKCQOO/SiFX2DoKfbOpvrcFR9A2vgjZh/oXWH8zVmhB6RNf8RrLuF/HZX1uSoLgLThPtTUot8cldyoK4mEtNm+bKkEK2wH8QkFTIJmSBvtS7JB/uooXGzy44C00SG8pop1dVU6tVBiSJscyuj7KQ22N5eG2MIyQtrgUI6I7Lq0ozAVU1BmSBscQx0qUlEUwgRpc2OpQkT21sYTyjmrsiFtbCx7X4HKsXHnu7EApI3N3krsGfkUYI4EpE1NoX4krsF2EtiF+cMOaVNT+HCy2FkbTOH+sEPa1FR2R+Lsq7k63B92SBuays89YcqxsoqyiBfShlJQuYTZg/kl3iNWSJtJQe0SNlorddEW8ULaTApuui3lWKnUiaANaTOpqNaiOmvhkGgSJ6SNpGK3FtVbC3WiSZyQNpKK/VrUaC1sU11ihLSRVBwXQa7n9J4J0kZSEoBpDesfBwqXGCFtIiVbYDugP8v8Y4G0iZTsgO2dQU3jExukTaSkBkwXtUnpiSBtIiUvwDaQlsgoLkibSMkBqIGUxAHYzkEUkVFckDaRkqNL0LNB2kRq1kAKYw2kMNZACiMm6wdFZBQXpA2k5ATU096SOAA1kJI4APXSSUm8APXiYknUQL38XhI7oN6gKoktUG/hlsT/MVkL2lSXGCFtIhWntajeWqgTTeKEtJFU7NeiOmvhkGgSJ6SNpGK3FqUcK9S/kvJy4/fNWqFLsokP0kZS0PnemPo4ghy1S5hyrKgiTeKEtJkUVHvi7G5LR1nEC2kzU3n4mqvOWnmMMIgb0oamsjsS18C8c9d7gwIgbWgKv+FxNmsP7qW3EmlTU6h9BCrHhp23PfyQNjWFyldkb204otyJorSpsexDRCpHATqkAEZIG5u9dSzQFIUwQNrYGOoYoQ22l+WvMQVlhrS5oZyQ0P3Xl2DSM/mjYoOj0Pqa2DgOFIJdk8UR5Zx1SZvsS69JoC9aRwW7rxVihrTRvmyphbtexv9OXUkEpI32oc4l3r4afEf9XMUjDtmUw/SBrlAkW4q04Ue8gWGsVdgO8pKhSJu+R9JB/BFeUE4o0sbvhSHypTZXKFf87s/miYSxYC8Uzs/GSQdQTBgLFNwD/R3APwz1S4ewkGUA98Xe2dfShf30jxMPKCiMNTT2d/qcqU7pMHQmXWRo4R5X7jDXwE7E9UkF8Y0nekqggfsqcY5gahcVgDdsb3LZwZyRdieSM4gJBPczpNHgeGxZ+AHTakKPPK4wdMS+FQ2F7b9Z9vgJ03JePcrNHUSPMv9LQAYFc7TtDfx7XdsHTEgnmKBe4X4+koLf8z6qDPqLRQPzB7y9+YsEb/M+/aiuKQYK5oiUCOeGX9gaQqBgjtIex2dosZzmsjvUEKLRwhioYZ7sGmZOcBu+LL/M23R4kkncf1kFUPkzkKP6AAAAAElFTkSuQmCC" width="100" height="100">');
							} else if (lunation >=0.87 && lunation <=0.99) {
								$('#moonPhase').html('Waning Crescent');
								$('#moonIcon').html('<img class="icon icons8-Waning-Crescent-Filled" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFdklEQVR4nO1d23WkOBC9IRBChTAZLCE4AyuD3QysDMYZmAzcGTQZjDOADLozmP0Q3mVESSoJupFA95z7Y1Rl6hZ6FY8G8kcD4C8ArwDeAHwCuE4cAPy2OMyOf042r5OPigQQjIAf4AVfy1+T71eYZFcwIAA/YcTaOgGSBL1N53BqNDBX6R5JcPGKE/YcgukNN+yfABdvMMMaPUSBTEAwQUoEGYXtnsHDJaaBGaNDgV8AKAAt8us9tymG4oeyF/hXSncAGv9fgT+QXzLmHKaYikMDM0G6AhthesMchLyTMecnCuotL3ALO2KZCMAEl9NqS8IbCugtP+EOQHvsPjx2ufMtXqbHw3eF9/CvUl4cdiXxioyGMII7Gf8IbEuZN0L8hQyS4loVjdOxEK6Mbcm8CeN+CFzJ+ILsSmkZ2yNwl6S4ktFF+BgY+6PwqUkhrE+GYuyPxhueMKe4VlNdpI8j9445Hz7Rr00GYFZeewv17KQ8BO/MP+sS/Jyld8z5nqCTF9zm7WsjP2dhm6AXC8JyEh+RNjZesI8YOXCzSf7KOE9Z0pHjRM/Ea4Juf4AbYnSiL24OOiOTK8Tc8rRPdcb4OisHJA5dmnFGKY5ghri9hciJOlZA2sLJDHplAEckxQjYWcYj1q0QSrsb+Ax2UvGIMVZSY6G/SkOSCGivhkaJkQdnK5XEUIfEa7DcBKqQUQBn3gyGGNwsKstg9DUWYtgp2FKofOLZk6/2NRagySDg3OmsBhPTmHxqC3DmYmIMiRPPnswvQbnD0BkEWwI1J95gNVIBsSXoMwi2BA62cMQ02qJUfJRnrp5BmgunrIO9TO8g9g6yJKq5cJ11MPTEoQS1oBjHbi7eYB1sZZp70WYQZEkcvoXj9gpboJZM4tkAyys55eEFDjqDAEtjCywn9C5CdB9qDSueClheyTpGdQ/6DAIsjZoTTkWI7oPttzLMCydcG6O6B7bfyjB7Trg2QnQf6m3bxIQM1h+3wt7BlciBE24r7B1cqawJyYw1IZmxJiQzLj6FtBX2DqxEjkDdh+TEnhOujRDdB9tvZWJCVIToPth+K8O8ALW4mBM1UMvvOVEByxtUW71XrTMIsDS2QL2FmxP/e/RqtA60YtndaDMIsCSOc/E662B9DOj57ObiKetgL5I8jL2DLIlqLhwxDbZ4lPSeQaClkGzxvqwGSiB4CH0GgZbAkROvvo6wHzUnHjENySt3GPWFHRnJJaA9bGmf2gLUV9rC9D4pqqzGg6+xEOOOwZZA5ROvwXJl5DUQoNa03LxDsJq1J/chZBBALaG4qSUCEmOoJIYR/ioNSSpiZxkOWLdRtBcLlZG3OYhxoGMcWNAbB3ME0hYiRjuZUAuNf1KniNhguWS9pjiaYPs6K0esGP7rRzC35+qfSeoZp/UzsWnsE3RbgNssDqgfUo6laBMoRcv8g5SHIc5cbGwT9PKCmwM+EvyMjJ+jc/OP8X+D2+DFJuVspZSt3vtn0WB9Urjl9FEp/T2uVSDw98pjkqIY+6Nx00k8hB9Yn5SRsT8K79jpl9q4pEh/d6llbI/AXZLxDVdSBuFJ9Yxtydw1Gd8guMvrfwtsj/Ls1lMmcClcq6/fMAVJ8tgeYbPYI6NkzKHhPuk3uE+689jlTp2g01PRwj0MDQBeGRtfD8uVdzygHPIoNPBP2FxiCOXMJxdkOkSF8AL/fuMGM5TR1N61asuFIza4n7E3GsjuqX/C9JoW+SXlPsVQZK9wgSCfvAdhu2fwHQdLhA2Cudpy6wV2j+iw/mHzotDAFBlzWl310zkdukdIQDC9Zo/kfE3/mx4aYcEgmKu0w2Mqwl+Tb4XaE5LRwgioYfYA/cQRS8HH2fHLZKNQyCbuX07cy5J9+nb2AAAAAElFTkSuQmCC" width="100" height="100">');
							} else {
								$('#moonPhase').html(':( not found');
							}
				} //end placeMoonPhase
				
				placeMoonPhase();
				
			} //end success
}); //end ajax DarkSky
}); //end json ip-api
}; //end big function getWeather

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


$(document).ready(function() {
	// Call big function when the page loads 
	getWeather();
	
});