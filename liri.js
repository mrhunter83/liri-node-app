// ----------------------------------------------
// Set up modules and import required files
// ----------------------------------------------
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdb = require('omdb');
var fs = require('fs');
var config = require('./keys.js');
// ----------------------------------------------
// Initialize twitter and spotify
// ----------------------------------------------
var client = new Twitter(config);
var spotify = new Spotify({
	id: '09b200f241fe4955b00a7d2cc7595874',
	secret: '5dc0cbd257f24c2c92fcc025b49e9854'
});
// ----------------------------------------------
// Set variables to take in command line input
// ----------------------------------------------
var command = process.argv[2];
var query = process.argv.slice(3);
// ----------------------------------------------
// Declare my 'LIRI' function
// ----------------------------------------------
var LIRI = function() {

// Conditionals api calls based on command line input
// First up: Twitter

if(command === 'my-tweets'){
	var params = {screen_name: 'doubtful3083'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			return console.log('Error occurred: ' + JSON.stringify(error));
		}
		for(i=19; i>=0; i--){
			console.log(tweets[i].text, 'Created: '+tweets[i].created_at);
			console.log('----------------------------------------------');
			fs.appendFile('log.txt', tweets[i].text+' Created: '+tweets[i].created_at, function(err, data) {
				if (err) {
					return console.log(err);
				}
			})
		} 
	});
}

// Next: Spotify

if(command === 'spotify-this-song'){
	console.log(query);
	spotify.search({ type: 'track', query: query, limit: 5 }, function(err, response) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		for(i=0; i<response.tracks.items.length; i++){
			console.log('Artist(s): '+response.tracks.items[i].artists[0].name);
			console.log('Song Name: '+response.tracks.items[i].name);
			console.log('Preview: '+response.tracks.items[i].preview_url);
			console.log('Album: '+response.tracks.items[i].album.name);
			console.log('--------------------------------------------------------------------')
			fs.appendFile('log.txt', response.tracks.items[i], function(err, data) {
				if (err) {
					return console.log(err);
				}
			})
		}
	});
}

// OMDb API call

if(command === 'movie-this'){ 
	request("http://www.omdbapi.com/?t=" + query +"&apikey=40e9cece", function(error, response, body) {
		if(error) {
			console.log('Error: '+error);
		}
		console.log('Status Code: '+(response));
		var movieInfo = JSON.parse(body);
		console.log('Title: '+movieInfo.Title);
		console.log('Year: '+movieInfo.Year);
		console.log('IMDb Rating: '+movieInfo.imdbRating);
		console.log('Rotten Tomatoes Rating: '+movieInfo.Ratings[1].Value);
		console.log('Country: '+movieInfo.Country);
		console.log('Language: '+movieInfo.Language);
		console.log('Plot: '+movieInfo.Plot);
		console.log('Actors: '+movieInfo.Actors);
		fs.appendFile('log.txt', movieInfo, function(err, data) {
			if (err) {
				return console.log(err);
			}
		})
	})
}
}

// Finally, 'do-what-it-says' command that reads
// a command from a text file and executes the command.
// If the command is one of the other three, the LIRI
// function is called.

if(command === 'do-what-it-says'){
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		var newData = data.split(",");
		command = newData[0].trim();
		query = newData[1].trim();
		console.log(query);
		LIRI(command, query);
	})
}
else {
	LIRI();
}