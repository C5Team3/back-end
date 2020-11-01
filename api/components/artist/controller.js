module.exports = function (injectedStore) {
    let store = injectedStore;
    const PAGE_SIZE = 20;

    async function createArtist(data) {
        const created = new store(data);
        await created.save();
        return created;
    }

    async function updateArtist(artistId, data) {
        const updated = await store.findOneAndUpdate({ _id: artistId }, data, {
            new: true,
            runValidators: true
        });
        return updated || false;
    }

    async function deleteArtist(artistId) {
        const deletedArtist = await store.findOneAndRemove({ _id: artistId }, {
            select: '_id'
        });
        return deletedArtist;
    }

    async function getArtists(page = 1) {
        const skip = (page - 1) * PAGE_SIZE;
        const artists = await store.find().skip(skip).limit(PAGE_SIZE);;
        const count = await store.countDocuments();
        const paginatedResponse = {
            totalPages: Math.ceil(count / PAGE_SIZE),
            currentPage: page,
            artists: artists
        };

        return paginatedResponse || [];
    }

    async function getArtist(artistQuery) {
        const artist = await store.findOne(artistQuery);
        return artist || false;
    }

    async function searchArtists(filter) {
        const artists = await store.find({ name: { $regex: filter, $options: 'i' } });
        return artists || [];
    }

    return {
        createArtist,
        updateArtist,
        deleteArtist,
        getArtists,
        getArtist,
        searchArtists
    }
}