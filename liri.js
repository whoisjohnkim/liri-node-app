require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var CLICommand = process.argv[2];
var CLITerm = process.argv.slice(3).join(" ");
var line = "\n-----------------------------------\n"

function logResults(output){
    fs.appendFile("log.txt", output, function(err) {

        // If an error was experienced we say it.
        if (err) {
          console.log(err);
        }
      });

}

function runLIRI(command, term){
    switch(command){
        case "concert-this":
            request('https://rest.bandsintown.com/artists/' + term + '/events?app_id=49ddb02bbf0bbfa885e6c361c2afc9ea', function(error, response, body) {
                if(error){
                    console.log("error: ", error);
                }
                else if(response.statusCode === 200){
                    var item = JSON.parse(body)[0];
                    var output = "Venue Name: " + item.venue.name + "\nLocation: " + item.venue.city + ", " + item.venue.region + "\nDate: " + moment(item.datetime).format("MM/DD/YYYY") + line;
                    console.log(output);
                    var logOutput = "node liri.js " + command + " " + term + "\n" + output;
                }
            });
            break;
        case "spotify-this-song":
            var spotifyTerm = "";
            if(term === ""){
                spotifyTerm = "The Sign Ace of Base";
            }else {
                spotifyTerm = term;
            }
            spotify.search({type: 'track', query: spotifyTerm}, function(err, data){
                if(err) {
                    console.log('Error occurred: ' + err);
                }
                // console.log(data.tracks.items[0]);
                var output = "Artists: ";
                for(var i = 0; i < data.tracks.items[0].artists.length; i++){
                    output += data.tracks.items[0].artists[i].name + ", ";
                }
                output += "\nSong Title: " + data.tracks.items[0].name + "\nPreview URL: " + data.tracks.items[0].preview_url + "\nAlbum Title: " + data.tracks.items[0].album.name + line;
                console.log(output);
                var logOutput = "node liri.js " + command + " " + term + "\n" + output;
                logResults(logOutput);
            })
            break;
        case "movie-this":
            var movieTerm = ""
            if(term === ""){
                movieTerm = "Mr. Nobody";
            }else{
                movieTerm = term;
            }
            request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieTerm, function(error, response, body){
                // console.log(JSON.parse(body));
                var item = JSON.parse(body);
                var output = "Title: " + item.Title + "\nRelease Year: " + item.Year + "\nimdb Rating: " + item.imdbRating + "\nRotten Tomato Rating: " + item.Ratings[1].Value + "\nCountry: " + item.Country + "\nLanguage(s): " + item.Language + "\nPlot: " + item.Plot + "\nActors: " + item.Actors + line;
                console.log(output);
                var logOutput = "node liri.js " + command + " " + term + "\n" + output;
                logResults(logOutput);
            })
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function(error, data) {
                if (error) {
                    return console.log(error);
                }
                var dataArr = data.split(",");
                runLIRI(dataArr[0], dataArr[1]);
            });
            break;
        case "help":
            console.log("In order to use this program you must enter a command with the following format: 'node liri <command> <search term>\nhe command 'concert-this' will return the next venue of the artist/band entered in the search.\nThe command 'spotify-this-song' will return information of the song entered in the search\nThe command 'movie-this' will return information of the movie entered in the search\nThe command do-what-it-says will take the command and search term from random.txt")
            break;
        default:
            console.log("Commands include 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says'. If you have more questions, type command 'help'")
    }
}

runLIRI(CLICommand, CLITerm);