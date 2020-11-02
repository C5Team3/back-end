const trackController = require('../track/controller');
const Track = require('../../../models/tracks');
const { response } = require('express');
module.exports = function (injectedStore) {
  let store = injectedStore;
  const PAGE_SIZE = 20;

  async function createAlbum(data) {
    const created = new store(data);
    await created.save();
    return created;
  }

  async function updateAlbum(albumId, data) {
    const updated = await store.findByIdAndUpdate({ _id: albumId }, data, {
      new: true,
      runValidators: true
    });
    return updated || false;
  }

  async function deleteAlbum(albumId) {
    const getDeletedAlbum = await store.findOneAndRemove({ _id: albumId }, {
      select: '_id'
    });
    return getDeletedAlbum;
  }

  async function getAlbums(page = 1) {
    const skip = (page - 1) * PAGE_SIZE;
    const albums = await store.find().skip(skip).limit(PAGE_SIZE);
    const count = await store.countDocuments();
    const paginatedResponse = {
      totalPages: Math.ceil(count / PAGE_SIZE),
      currentPage: page,
      albums: albums
    };

    return paginatedResponse || [];
  }

  async function getAlbum(albumQuery) {
    const album = await store.findOne(albumQuery);
    return album || false;
  }

  async function getAlbumTracks(albumId){
    TrackController = trackController(Track);
    const albumTracks = await TrackController.getFilterTracks({ album_Id: albumId});
    return albumTracks;
  }

  return {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbum,
    getAlbums,
    getAlbumTracks
  }
}