module.exports = function(injectedStore){
    let store = injectedStore;

    async function createArtist(data) {
        const created = new store(data);
        await created.save();
        return created;
    }
    
    async function updateArtist(artistId, data) {
        const updated = await store.findOneAndUpdate({ artistId }, data, {
            new: true,
            runValidators: true
        });
        return updated || false;
    }

    async function deleteArtist(artistId) {
        await store.findOneAndUpdate({ _id:artistId }, { deleted_at: new Date() });
        const getDeleted = await this.getArtist(artistId);
        return getDeleted;
    }

    async function getArtists(){
        const artists = await store.find( { deleted_at: null });
        return artists || [];
    }

    async function getArtist(artistId) {
        const artist = await store.findOne({ _id: artistId });
        return artist || false;
    }

    return {
        createArtist,
        updateArtist,
        deleteArtist,
        getArtists,
        getArtist
    }
}