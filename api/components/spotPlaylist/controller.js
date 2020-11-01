module.exports = function (injectedStore) {
    let store = injectedStore;

    async function getUnprocessedSpots() {
        const unprocessedSpots = await store.find({ processed: null });
        return unprocessedSpots || [];
    }

    return {
        getUnprocessedSpots
    }

}