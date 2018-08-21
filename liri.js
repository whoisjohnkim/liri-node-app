require("dotenv").config();
var spotify = require("./keys.js");
console.log(spotify);

var command = process.argv[2];
switch(command){
    case concert-this:
        break;
    case spotify-this-song:
        break;
    case movie-this:
        break;
    case do-what-it-says:
        break;
    case help:
        break;
    default:
        console.log("Commands include 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says'. If you have more questions, type command 'help'")
}