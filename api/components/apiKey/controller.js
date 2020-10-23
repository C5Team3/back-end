module.exports = function(injectedStore){
  let store = injectedStore;

  async function createApiKey(data) {
      const created = new store(data);
      await created.save();
      return created;
  }

  async function deleteApiKey(apiKeyId) {
      const getDeletedApiKey = await store.findOneAndRemove({_id:apiKeyId},{
        select:'_id'
      });
      return getDeletedApiKey;
  }

  async function getApiKeys(){
      const ApiKeys = await store.find();
      return ApiKeys || [];
  }
  async function emptyApiKeys(){
      await store.deleteMany();
      const ApiKeys = await store.find();
      return ApiKeys || [];
  }

  return {
      createApiKey,
      deleteApiKey,
      getApiKeys,
      emptyApiKeys
  }
}