
const api_key_GMG = "AIzaSyBvjkpUHS76A7gKVMZY0ixaCT2QrWDBfug";
const api_key_Ticket = "whOI5zssUuyTfpIQ32UhBP6cJ1xYCReq";
const search_engine_id = '009410266545012049863:djim3evao50';
const api_Songkick = 'ew7MunwY0lpBMidB';

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

var rp = require('request-promise');


var geohash = require('ngeohash');

var path = require('path');
app.use(express.static(path.join(__dirname,'')));
app.get('/',(req,res)=>{
        res.sendFile(path.join(__dirname,'siqi-7.html'))
});

app.get('/formData', function(req, res) {

    var keyword = req.query.keyword;
    var category = req.query.category;
    var distance = req.query.distance;
    var curLat = req.query.curLat;
    var curLon = req.query.curLon;
    var geoCurPoint = geohash.encode(curLat, curLon);
    var location = req.query.location;
    var choice = req.query.choice;
    var d_choice = req.query.d_choice;

    if(distance ==""){
        distance = 10;
    }
    else{
        distance = req.query.distance;
    }

    var segmentId = {
        music : "KZFzniwnSyZfZ7v7nJ",
        sports : "KZFzniwnSyZfZ7v7nE",
        artsthreatre : "KZFzniwnSyZfZ7v7na",
        film : "KZFzniwnSyZfZ7v7nn",
        miscellaneous : "KZFzniwnSyZfZ7v7n1"
    };
    var element;
    var segmentId_Num = "";
    for (element in segmentId){
        if (element == category){
            segmentId_Num = segmentId[element]; 
        }
    }


    if (choice == "here") {

        var url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + api_key_Ticket + '&keyword=' + keyword +'&segmentId=' + segmentId_Num + 
            '&radius=' + distance + '&unit='+ d_choice +'&geoPoint=' + geoCurPoint;
        // $url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.0266,-118.2831&radius=16093.44&type=default&keyword=usc&key=AIzaSyBix1e20sK7gC5h48EvDc7SbRhVdn5GH8U';
        console.log("Your choice is here");
        console.log("here_ticket_url: " + url + "/n");
        callAPI_Search(url)
            .then(function(data) {
                res.header("Content-Type", 'application/json');
                res.send(JSON.stringify(data, null, 4));
            }).catch(err => {
                console.log(err);
                console.log('err');
                res.status(500).send(err);
            })
    }
    else {
        var locUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + api_key_GMG;
      
        callAPI_Search(locUrl)
            .then(function(data) {
                loc_lat = data['results']['0']['geometry']['location']['lat'];
                loc_lng = data['results']['0']['geometry']['location']['lng'];
                var geoLocPoint = geohash.encode(loc_lat, loc_lng);
                loc = loc_lat + "," + loc_lng;
                console.log("Your choice is to locate");
                console.log(loc+"/n");
                var url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + api_key_Ticket + '&keyword=' + keyword +'&segmentId=' + segmentId_Num + 
            '&radius=' + distance + '&unit=miles&geoPoint=' + geoLocPoint;
                // $url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=whOI5zssUuyTfpIQ32UhBP6cJ1xYCReq&keyword=lakers&segmentId=&radius=10&unit=miles&geoPoint=dr5regw3p';
                console.log("loc_ticket_url: " + url +"/n");
                callAPI_Search(url)
                    .then(function(data) {
                        res.header("Content-Type", 'application/json');
                        res.send(JSON.stringify(data, null, 4));
                    }).catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    });
            }).catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    } 

});

app.get('/ArtistTeamPhotos', function(req, res) {
    var art_teams = req.query.art_teams;
    console.log("You look for photos of " + art_teams +"/n");
    var url = 'https://www.googleapis.com/customsearch/v1?q=' + art_teams + '&cx=' + search_engine_id +'&imgSize=huge&imgType=news&num=8&searchType=image&key=' + api_key_GMG;
    // $url = 'https://www.googleapis.com/customsearch/v1?q=USC+Trojans&cx=009410266545012049863:djim3evao50&imgSize=huge&imgType=news&num=9&searchType=image&key=AIzaSyBvjkpUHS76A7gKVMZY0ixaCT2QrWDBfug';
    console.log("photos_url: "+ url+"/n");
    callAPI_Search(url)
        .then(function(data) {
            res.header("Content-Type", 'application/json');
            res.send(JSON.stringify(data, null, 4));
        }).catch(err => {
            console.log(err);
            console.log('err');
            res.status(500).send(err);
        });

});

const clientId = '5a9472c184fa43d59697888f7d774bac',
clientSecret = '56012f621f1e4504a02b5f90c82f1003';
var SpotifyWebApi = require('spotify-web-api-node');


app.get('/Music_ArtistTeam', function(req, res) {
    var art_teams = req.query.art_teams;
    console.log("You look for spotifyinfo of " + art_teams + "/n");
    //console.log(art_teams);

    // Create the api object with the credentials
    var spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret
    });

    spotifyApi.searchArtists(art_teams)
      .then(function(data) {

        //console.log('Search artists by' + art_teams, data.body);
        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(data, null, 4));

      }, function(err) {
        //console.error(err);

        // Retrieve an access token.
        spotifyApi.clientCredentialsGrant().then(
          function(data) {
            //console.log('The access token expires in ' + data.body['expires_in']);
            //console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            // Search artists whose name contains 'Love'
            spotifyApi.searchArtists(art_teams)
              .then(function(data) {
                //console.log('Search artists by' + art_teams, data.body);
                res.header("Content-Type", 'application/json');
                res.send(JSON.stringify(data, null, 4));
              }, function(err) {
                //console.error(err);
              });

          },
          function(err) {
            //console.log('Something went wrong when retrieving an access token', err);
            res.status(500).send(err);
          }
        );

      });

});

app.get('/UpcomingEvents', function(req, res) {
    var venue_name = req.query.venue_name;
    console.log("You look for UpcomingEvents of " + venue_name);
    //console.log(art_teams);
    var url = 'https://api.songkick.com/api/3.0/search/venues.json?query=' + venue_name + '&apikey=' + api_Songkick;
    // $url = 'https://www.googleapis.com/customsearch/v1?q=USC+Trojans&cx=009410266545012049863:djim3evao50&imgSize=huge&imgType=news&num=9&searchType=image&key=AIzaSyBvjkpUHS76A7gKVMZY0ixaCT2QrWDBfug';
    console.log("venue_url: "+ url);
    callAPI_Search(url)
        .then(function(data) {
            //console.log(data.resultsPage.results.venue[0].id);
            var venue_id = data.resultsPage.results.venue[0].id;
            var url1 = "https://api.songkick.com/api/3.0/venues/" + venue_id +"/calendar.json?apikey=" + api_Songkick;
            console.log("Upcomingevents_url: "+ url1);
            callAPI_Search(url1)
            .then(function(data1) {
                console.log(data1);
                res.header("Content-Type", 'application/json');
                res.send(JSON.stringify(data1, null, 4));
            }).catch(err => {
                console.log(err);
                console.log('err');
                res.status(500).send(err);
            });

        }).catch(err => {
            console.log(err);
            console.log('err');
            res.status(500).send(err);
        });

});

app.get('/Autocomplete', function(req, res) {
    var auto_keyword = req.query.auto_keyword;
    console.log("You look for photos of " + auto_keyword +"/n");
    var url = 'https://app.ticketmaster.com/discovery/v2/suggest?apikey=' + api_key_Ticket + '&keyword=' + auto_keyword;
    // $url = 'https://www.googleapis.com/customsearch/v1?q=USC+Trojans&cx=009410266545012049863:djim3evao50&imgSize=huge&imgType=news&num=9&searchType=image&key=AIzaSyBvjkpUHS76A7gKVMZY0ixaCT2QrWDBfug';
    console.log("AUTO_url: "+ url+"/n");
    callAPI_Search(url)
        .then(function(data) {
            //console.log('success');
            res.header("Content-Type", 'application/json');
            res.send(JSON.stringify(data, null, 4));
        }).catch(err => {
            console.log(err);
            console.log('err');
            res.status(500).send(err);
        });

});



var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})


function callAPI_Search(url) {
    //console.log("call API");
    let options = {
        uri: url,
        json: true
    };
    return rp(options)
        .then(function(repos) {
            return repos;
        });
}
