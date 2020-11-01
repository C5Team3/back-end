const { Date } = require("mongoose");
const moment = require('moment');

module.exports = function (injectedStore) {
    let store = injectedStore;
    const FAVORITE_TYPE = 'FAVORITE';
    const GENERAL_TYPE = 'GENERAL';

    async function createPlaylist(data, user) {
        const createdPlaylist = new store(data);
        await createdPlaylist.save();
        const subscribed = await subscribe(createdPlaylist._id, user);
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

    async function getPlaylists(userId) {
        const Playlists = await store.find({ "subscribers.userId" : userId }).populate('tracks.trackId');
        return Playlists || [];
    }

    async function getPlaylist(playlistId, userId) {
        const Playlist = await store.findOne({ _id: playlistId, "subscribers.userId" : userId }).populate('tracks.trackId');
        return Playlist || false;
    }

    async function addPlaylistTrack(playlistId, track) {
        const playlist = await store.findOne({ _id: playlistId });
        const playlistTrack = {
            trackId: track,
            addedDate: moment(new Date())
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
                subscribedDate: moment.utc(new Date())
            }]
        };
        const favoritePlaylist = new store(favPlaylist);
        await favoritePlaylist.save();
        return favoritePlaylist;
    }

    async function getFavorites(userId) {
        const userFavs = await store.findOne({ type: FAVORITE_TYPE, subscribers: { userId: userId }}).populate('tracks.trackId');
        return userFavs || false;
    }

    async function subscribe(playlistId, userId){
        const playlist = await store.findOne({ _id: playlistId });
        const playlistSubscriber = {
            userId: userId,
            subscribedDate: moment(new Date())
        };
        playlist.subscribers.push(playlistSubscriber);
        const updatedPlaylist = await playlist.save();
        return updatedPlaylist || false;
    }

    async function unsubscribe(playlistId, userId) {
        const playlist = await store.findOneAndUpdate({ _id: playlistId }, { $pull: { subscribers: { userId: userId } }});
        return playlist;
    }

    async function searchPlaylists(filter) {
        try {
            const playlists = await store.find({ "name": { $regex: filter, $options: 'i' } }).populate('tracks.trackId');
            return playlists || [];
        } catch (error) {
            console.log(error);
        }
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
        unsubscribe,
        searchPlaylists
    }
}