const { Schema, model, models } = require('mongoose');

const searchHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    usedFilter: { type: String, max: 100, required: true },
    searchDate: { type: Date, required: true },
    searchResults: {
        artists: [ {type: Schema.Types.ObjectId, ref: 'Artists' } ],
        tracks: [ {type: Schema.Types.ObjectId, ref: 'Tracks' } ],
        playlists: [ {type: Schema.Types.ObjectId, ref: 'Playlists' } ]
    }
}, { timestamps: true });

module.exports = model('Search_History', searchHistorySchema);