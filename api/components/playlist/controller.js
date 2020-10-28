const { Date } = require("mongoose");
const moment = require('moment');

module.exports = function (injectedStore) {
    let store = injectedStore;
    const FAVORITE_TYPE = 'FAVORITE';
    const GENERAL_TYPE = 'GENERAL';

    async function createPlaylist(data) {
        const createdPlaylist = new store(data);
        await createdPlaylist.save();
        return createdPlaylist;
    }

    async function updatePlaylist(playlistId, data) {
        const updated = await store.findOneAndUpdate({ _id: playlistId }, data, {
            new: true,
            runValidators: true
        });
        return updated || false;
    }

    async function deletePlaylist(playlistId) {
        const deletedPlaylist = await store.findOneAndRemove({ _id: playlistId, type: GENERAL_TYPE }, {
            select: '_id'
        });
        return deletedPlaylist;
    }

    async function getPlaylists() {
        const Playlists = await store.find();
        return Playlists || [];
    }

    async function getPlaylist(playlistId) {
        const Playlist = await store.findOne({ _id: playlistId });
        return Playlist || false;
    }

    async function addPlaylistTrack(playlistId, track) {
        const playlist = await store.findOne({ _id: playlistId });

        const playlistTrack = {
            trackId: track,
            addedDate: moment.utc(new Date())
        };
        playlist.tracks.push(playlistTrack);
        const updatedPlaylist = await playlist.save();
        return updatedPlaylist || false;
    }

    async function deletePlaylistTrack(playlistId, playlistTrackId) {
        const playlist = await store.findOne({ _id: playlistId });
        playlist.tracks.trackId(playlistTrackId).remove();
        const updated = playlist.save();
        return updated || false;
    }

    async function createFavPlaylist(user) {
        const playlistExists = await store.findOne({ type: FAVORITE_TYPE, subscribers: { userId: user._id }});
        if(playlistExists)
            return playlistExists;

        const favPlaylist = {
            name: `${user.name}'s Favorites`,
            type: FAVORITE_TYPE,
            tracks: [],
            subscribers: [{
                userId: user._id,
                subscribedDate: new Date()
            }]
        };
        const favoritePlaylist = new store(favPlaylist);
        await favoritePlaylist.save();
        return favoritePlaylist;
    }

    async function getFavorites(userId) {
        const userFavs = await store.findOne({ type: FAVORITE_TYPE, subscribers: { userId: userId }});
        return userFavs || false;
    }

    async function subscribe(playlistId, userId){
        const playlist = await store.findOne({ _id: playlistId });
        const playlistSubscriber = {
            userId: userId,
            subscribedDate: new Date()
        };
        playlist.subscribers.push(playlistSubscriber);
        const updatedPlaylist = await playlist.save();
        return updatedPlaylist || false;
    }

    async function unsubscribe(playlistId, userId) {
        const playlist = await store.findOne({ _id: playlistId });
        playlist.subscribers.userId(userId).remove();
        const updated = playlist.save();
        return updated || false;
    }

    return {
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        getPlaylists,
        getPlaylist,
        addPlaylistTrack,
        deletePlaylistTrack,
        createFavPlaylist,
        getFavorites,
        subscribe,
        unsubscribe
    }
}