module.exports = function(injectedStore){
  let store = injectedStore;

  async function createAlbum(data) {
      const created = new store(data);
      await created.save();
      return created;
  }
  
  async function updateAlbum(albumId, data) {
      const updated = await store.findByIdAndUpdate({ _id:albumId }, data,{
        new:true,
        runValidators:true
      });
      return updated || false;
  }

  async function deleteAlbum(albumId) {
      const getDeletedAlbum = await store.findOneAndRemove({_id:albumId},{
        select:'_id'
      });
      return getDeletedAlbum;
  }

  async function getAlbums(){
      const albums = await store.find( { deleted_at: null });
      return albums || [];
  }

  async function getAlbum(albumId) {
      const album = await store.findOne({ _id: albumId });
      return album || false;
  }

  return {
      createAlbum,
      updateAlbum,
      deleteAlbum,
      getAlbum,
      getAlbums
  }
}