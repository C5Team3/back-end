module.exports = function (injectedStore) {
  let store = injectedStore;

  async function createTrack(data) {
    const created = new store(data);
    await created.save();
    return created;
  }

  async function updateTrack(trackId, data) {
    const updated = await store.findByIdAndUpdate({ _id: trackId }, data, {
      new: true,
      runValidators: true
    });
    return updated || false;
  }

  async function deleteTrack(trackId) {
    const getDeletedTrack = await store.findOneAndRemove({ _id: trackId }, {
      select: '_id'
    });
    return getDeletedTrack;
  }

  async function getTracks() {
    const tracks = await store.find({ deleted_at: null });
    return tracks || [];
  }

  async function getTrack(queryTrack) {
    const track = await store.findOne(queryTrack);
    return track || false;
  }

  async function searchTracks(filter) {
    const tracks = await store.find({ title: { $regex: filter, $options: 'i' } });
    return tracks || [];
  }


  return {
    createTrack,
    updateTrack,
    deleteTrack,
    getTrack,
    getTracks,
    searchTracks
  }
}