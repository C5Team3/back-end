const { Schema, model, models } = require('mongoose');

const playlistTrackSchema = new Schema({
    trackId: { type: Schema.Types.ObjectId, ref: 'Tracks', required: true },
    addedDate: { type: Date }
});
var playlistTracks = model('PlaylistTrack', playlistTrackSchema);

const playListSubscribersSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    subscribedDate: { type: Date }
});
var subscribers = model('PlaylistSubscribers', playListSubscribersSchema);

const playlistSchema = new Schema({
    name: { type: String, required: [true, 'Playlist Name is required'], trim: true },
    type: { type: String, required: [true, 'Playlist type is required'], default: 'USER' },
    tracks: [ playlistTrackSchema ],
    subscribers: [ playListSubscribersSchema ]
}, { timestamps: true });

playlistSchema.post('save', function(doc, next) {
    doc.populate('tracks.trackId').execPopulate().then(function() {
      next();
    });
  });

module.exports = model('Playlists', playlistSchema);