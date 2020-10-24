module.exports = function(injectedStore){
    let store = injectedStore;

    async function createGender(data) {
        const created = new store(data);
        await created.save();
        return created;
    }
    
    async function updateGender(genderId, data) {
        const updated = await store.findOneAndUpdate({ _id: genderId }, data, {
            new: true,
            runValidators: true
        });
        return updated || false;
    }

    async function deleteGender(genderId) {
        const deletedGender = await store.findOneAndRemove({ _id: genderId }, { 
            select: _id 
        });
        return deletedGender;
    }

    async function getGenders(){
        const Genders = await store.find();
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