module.exports = function (injectedStore) {
  let store = injectedStore;
  const PAGE_SIZE = 20;

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

  async function getTracks(page = 1) {
    const skip = (page - 1) * PAGE_SIZE;
    const tracks = await store.find().skip(skip).limit(PAGE_SIZE).populate('artist_Id', 'name cover_img');
    const count = await store.countDocuments();
    const paginatedResponse = {
      totalPages: Math.ceil(count / PAGE_SIZE),
      currentPage: page ? page : 1,
      tracks: tracks
    };
    return paginatedResponse || [];
  }

  async function getTrack(queryTrack) {
    const track = await store.findOne(queryTrack).populate('artist_Id', 'name cover_img');
    return track || false;
  }

  async function searchTracks(filter) {
    const tracks = await store.find({ title: { $regex: filter, $options: 'i' } }).populate('artist_Id', 'name cover_img');
    return tracks || [];
  }

  async function getFilterTracks(query) {
    try {
      const tracks = await store.find(query).populate('artist_Id', 'name cover_img');
      return tracks || [];
      // const topSearchs = await store.aggregate([
      //   { $group: { _id: { album_Id : '$album_Id'}, busquedas: { $sum: 1 }, results: { $push: '$$ROOT' } } },
      //   { $sort: { busquedas: -1 } },
      //   { $limit: 5 }
      // ]);
      return topSearchs;
    } catch (err) {
      console.log(err);
    }
  }


  return {
    createTrack,
    updateTrack,
    deleteTrack,
    getTrack,
    getTracks,
    searchTracks,
    getFilterTracks
  }
}