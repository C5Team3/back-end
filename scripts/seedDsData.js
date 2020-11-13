const moment = require('moment');
const db = require('../lib/db');

// Models
const User = require('../models/users');
const UserController = require('../api/components/user/controller');

const Playlist = require('../models/playlists');
const PlaylistController = require('../api/components/playlist/controller');

const Track = require('../models/tracks');
const TrackController = require('../api/components/track/controller');

const Album = require('../models/albums');
const AlbumController = require('../api/components/album/controller');

const Artist = require('../models/artists');
const ArtistController = require('../api/components/artist/controller');

const SpotPlaylist = require('../models/spotPlaylists');
const SpotPlaylistController = require('../api/components/spotPlaylist/controller');
const playlists = require('../models/playlists');


async function getDsData() {
    const spotPlaylist = SpotPlaylistController(SpotPlaylist);

    try {
        db.connect();
        const results = await spotPlaylist.getUnprocessedSpots();
        return results;
    } catch (err) {
        console.log(err);
    }
}

async function processPlaylist(playlist, index) {
    try {
        const userController = UserController(User);
        const playlistController = PlaylistController(Playlist);

        let user;
        let suggestedPlaylist;
        if (playlist.type === 'user-playlist') {
            //find user by id, if no exists skip the playlist
            user = await userController.getUserByEmail(playlist.user_id);
            if (!user) {
                console.log(`User ${playlist.user_id} not found`);
                return false;
            }
            suggestedPlaylist = {
                type: "SUGGESTED",
                name: playlist.title
            };
        }else {
            suggestedPlaylist = {
                type: "GENERAL",
                name: playlist.title
            };
        }

        const createdPlaylist = await playlistController.createPlaylist(suggestedPlaylist);
        if(user && playlist.type === 'user-playlist'){
            console.log('entro al subscribe', playlist.type);
            let subscribedList = await playlistController.subscribe(createdPlaylist._id, user._id);
            console.log(`Usuario ${user.email} subscrito a la lista ${subscribedList._id}`);
        }

        //process sugested tracks
        let process = playlist.tracks.map(async (spotTrack) => {
            let trackId = await processTrack(spotTrack);
            await playlistController.addPlaylistTrack(createdPlaylist._id, trackId);
        });
        
        await Promise.all(process);

        playlist.processed = true;
        await playlist.save();

    } catch (err) {
        console.log(err);
    }
}

async function processTrack(spotTrack) {
    const trackController = TrackController(Track);
    const artistController = ArtistController(Artist);
    const albumController = AlbumController(Album);

    //If track exists returns id
    let track = await trackController.getTrack({ spotifyId: spotTrack.track_id });
    if (track)
        return track._id;

    // //process the artist
    let artist = await artistController.getArtist({ spotifyId: spotTrack.artist_id });
    if (!artist) {
        artist = await artistController.createArtist({
            name: spotTrack.artist_name,
            spotifyId: spotTrack.artist_id,
            cover_img: spotTrack.artist_img
        });
    }

    // //Process album
    let album = await albumController.getAlbum({ spotifyId: spotTrack.album_id });
    if (!album) {
        album = await albumController.createAlbum({
            title: spotTrack.album_name,
            spotifyId: spotTrack.album_id,
            year: spotTrack.year,
            cover_img: spotTrack.album_img,
            artist_id: artist._id
        });
    }

    // //Create the track
    track = await trackController.createTrack({
        title: spotTrack.track_title,
        duration_ms: spotTrack.duration_ms,
        spotifyId: spotTrack.track_id,
        genres: spotTrack.genre,
        album_id: album._id,
        artist_id: artist._id,
        url: spotTrack.preview_url
    });

    return track._id;
}

async function processDsData() {
    try {
        let data = await getDsData();
        const processedLists = data.map(async (spotPlaylist, index) => {
            await processPlaylist(spotPlaylist, index);
        });
        await Promise.all(processedLists);
        return process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

processDsData();