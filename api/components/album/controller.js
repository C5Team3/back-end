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
      console.log('Llegó al controller');
      const albums = await store.find();
      return albums || [];
  }

  async function getAlbum(albumQuery) {
      const album = await store.findOne(albumQuery);
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