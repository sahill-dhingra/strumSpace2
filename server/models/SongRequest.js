const mongoose = require('mongoose');

const songRequestSchema = new mongoose.Schema({
    songtitle: {
            type: String,
            required: true 
        },
    artistBand: {
            type: String,
            required: true 
        },
    ytlink: {
            type: String, 
            required: true 
    },
    additional: { 
            type: String 
    }
});

const SongRequest = mongoose.model('SongRequest', songRequestSchema);

module.exports = SongRequest;
