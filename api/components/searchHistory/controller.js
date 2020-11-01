const moment = require('moment');

// Models
const Artist = require('../../../models/artists');
const Track = require('../../../models/tracks');
const Playlist = require('../../../models/playlists');

// Controllers
const artistController = require('../artist/controller');
const trackController = require('../track/controller');
const playlistController = require('../playlist/controller');

module.exports = function (injectedStore) {
    let store = injectedStore;

    async function search(filterText, user) {

        //Search artists 
        ArtistController = artistController(Artist);
        const artistsResults = await ArtistController.searchArtists(filterText);

        //Search Tracks
        TrackController = trackController(Track);
        const tracksResults = await TrackController.searchTracks(filterText);

        //Search Playlists
        PlaylistController = playlistController(Playlist);
        const playlistsResults = await PlaylistController.searchPlaylists(filterText);

        const result = {
            userId: user,
            searchDate: moment(new Date()),
            usedFilter: filterText,
            searchResults: {
                artists: artistsResults,
                tracks: tracksResults,
                playlists: playlistsResults
            }
        };

        return await saveSearchHistory(result);
    }

    async function saveSearchHistory(data) {
        const created = new store(data);
        await created.save();
        return created;
    }

    async function getLastSearchs(user) {
        const lastSearchs = await store.find({ userId: user }).sort({ searchDate: -1 }).limit(5)
            .populate('artists')
            .populate('tracks')
            .populate('playlists');
        return lastSearchs || [];
    }

    async function getTopSearches() {
        const topSearchs = await store.aggregate([
            { $group: { _id: { $toLower: '$usedFilter' }, busquedas: { $sum: 1 }, results: { $push: '$$ROOT' } } },
            { $sort: { busquedas: -1 } },
            { $limit: 5 }
        ]);
        return topSearchs;
    }

    return {
        search,
        getLastSearchs,
        getTopSearches
    }
}