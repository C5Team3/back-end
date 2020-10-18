module.exports = function(injectedStore){
    let store = injectedStore;

    async function createUser(data) {
        const created = new store(data);
        await created.save();
        return created;
    }
    
    async function updateUser(userId, data) {
        const updated = await store.findOneAndUpdate({ userId }, data, {
            new: true,
            runValidators: true
        });
        return updated || false;
    }

    async function deleteUser(userId) {
        await store.findOneAndUpdate({ userId }, { deleted_at: new Date() });
        const getDeleted = await this.getUser(_id);
        return getDeleted;
    }

    async function getUsers(){
        const users = await store.find( { deleted_at: null });
        return users || [];
    }

    async function getUser(userId) {
        const user = await store.findOne({ _id: userId });
        return user || false;
    }

    async function getUserByEmail(email) {
        const user = await store.findOne({ email });
        return user || false;
    }

    async function getOrCreateUser(data) {
        const user = await store.findOne({ email: data.email });
        if (user) 
            return user;
        await this.createUser(data);
        return await this.getUserByEmail(data.email);
    }

    return {
        createUser,
        updateUser,
        deleteUser,
        getUser,
        getUsers,
        getUserByEmail,
        getOrCreateUser
    }
}