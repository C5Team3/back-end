const { Schema, model, models } = require('mongoose');

const searchHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    usedFilter: { type: String, max: 100, required: true },
    searchDate: { type: Date, required: true },
    searchResults: {
        artists: [{
            artistId: { type: Schema.Types.ObjectId, ref: 'Artists' },
            name: { type: String },
            cover_img: { type: String }
        }],
        tracks: [{
            trackId: { type: Schema.Types.ObjectId, ref: 'Tracks' },
            title: { type: String },
            url: { type: String }
        }],
        playlists: [{
            playlistId: { type: Schema.Types.ObjectId, ref: 'Playlists' },
            name: { type: String }
        }]
    }
}, { timestamps: true });

module.exports = model('Search_History', searchHistorySchema);