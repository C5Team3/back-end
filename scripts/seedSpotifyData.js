// DEBUG=app:* node ./scripts/seedApiKeys.js

const chalk = require('chalk');
const debug = require('debug')('app:scripts:api-seed-spotify Data');
const db = require('../lib/db');
const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../config/index');

// Connecting To DB



/* -------------------------------------------------------------------------- */
/*                             Spotify API Connect                            */
/* -------------------------------------------------------------------------- */

const clientId = config.spotify_client_id;
const clientSecret = config.spotify_client_secret;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
});


// Models

const Track = require('../models/tracks');
const TrackController = require('../api/components/track/controller');
const trackController = TrackController(Track);

const Album = require('../models/albums');
const AlbumController = require('../api/components/album/controller');
const albumController = AlbumController(Album);

const Artist = require('../models/artists');
const ArtistController = require('../api/components/artist/controller');
const artistController = ArtistController(Artist);



/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */
async function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function randomSeedGenres(genres) {
	const randomSeed = await getRandomInt(0,	genres.length);
	console.log(genres[randomSeed]);
	return genres[randomSeed];
}

async function processTrack(spotifyTrack) {
	
	// Processing Artist
	
	const artist = await spotifyApi.getArtist(spotifyTrack.artists[0].id);

	const newArtist = {
		spotifyId:artist.body.id,
		name: artist.body.name,
		cover_img: artist.body.images[0].url,
	}
	let findArtist = await artistController.getArtist({
    spotifyId: spotifyTrack.artists[0].id
	});
	
	if (!findArtist) {
     	findArtist = await artistController.createArtist(newArtist);
	}
	
	// Processing Album

  const album = await spotifyApi.getAlbum(spotifyTrack.album.id);
  const newAlbum = {
    spotifyId: album.body.id,
    title: album.body.name,
    subtitle: album.body.label,
    year: album.body.release_date,
		cover_img: album.body.images[0].url,
		artist_Id: findArtist._id
	};
	
	let findAlbum = await albumController.getAlbum({
    spotifyId: album.body.id,
	});
	
  if (!findAlbum) {
    findAlbum = await albumController.createAlbum(newAlbum);
	}
	
// Processing Tracks
	
const { name, duration_ms, preview_url, id} = spotifyTrack;

  const newTrack = {
    title: name,
    duration_ms,
    url: preview_url,
		spotifyId: id,
		genres:artist.body.genres,
    album_Id: findAlbum._id,
		artist_Id: findArtist._id,
  };
  let findTrack = await trackController.getTrack({spotifyId: spotifyTrack.id});
	
  if (!findTrack) {
		findTrack = await trackController.createTrack(newTrack);
		console.log(`Creando:${findTrack.title}`);
	}
	else{
		console.log(`La cancion fue encontrada:${findTrack.title} +id ${findTrack.spotifyId}`);
	}
}

async function seedSpotifyPlayList() {
  try {
  
    if(config.db_test_mode=="true"){
      const db_test = config.db_local_test_url;
      debug(chalk.blue("Changing DB Mode to Testing, Connected to Test DB"));
      db.connect(db_test);
    }
    else{
      debug(chalk.red("Connected to Production DB"));
      db.connect();
    }
    
    // Get Access token
    const spotifyCredentials = await spotifyApi.clientCredentialsGrant();
    const accessToken = spotifyCredentials.body.access_token;
  
    // Set Access Token
    spotifyApi.setAccessToken(accessToken);

    /* -------------------------------------------------------------------------- */
    /*                          Get available genre seeds                         */
    /* -------------------------------------------------------------------------- */

    const result = await spotifyApi.getAvailableGenreSeeds();
		const randomSeed = await randomSeedGenres(result.body.genres);
		console.log("Seed PlayList:"+randomSeed);
				
		
    /* -------------------------------------------------------------------------- */
    /*                             Get Recommendations                             */
    /* -------------------------------------------------------------------------- */

    const recomendations = await spotifyApi.getRecommendations({
      min_energy: 0.4,
      seed_genres: [randomSeed],
      min_popularity: 50,
    });
    const tracks = recomendations.body.tracks;

    const promises = tracks.map(async (track) => {
      // TODO --> Filter Null URl Tracks
      await processTrack(track);
    });

    /* -------------------------------------------------------------------------- */
    /*                              Processing Tracks                             */
    /* -------------------------------------------------------------------------- */

    await Promise.all(promises);
    debug(chalk.green(`${promises.length} Tracks success full added`));

    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}

seedSpotifyPlayList();
