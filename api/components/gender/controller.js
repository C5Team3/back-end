module.exports = function(injectedStore){
    let store = injectedStore;

    async function createGender(data) {
        const created = new store(data);
        await created.save();
        return created;
    }
    
    async function updateGender(genderId, data) {
        const updated = await store.findOneAndUpdate({ genderId }, data, {
            new: true,
            runValidators: true
        });
        return updated || false;
    }

    async function deleteGender(genderId) {
        await store.findOneAndUpdate({ genderId }, { deleted_at: new Date() });
        const getDeleted = await this.getGender(_id);
        return getDeleted;
    }

    async function getGenders(){
        const Genders = await store.find( { deleted_at: null });
        return Genders || [];
    }

    async function getGender(genderId) {
        const Gender = await store.findOne({ _id: genderId });
        return Gender || false;
    }

    return {
        createGender,
        updateGender,
        deleteGender,
        getGenders,
        getGender
    }
}