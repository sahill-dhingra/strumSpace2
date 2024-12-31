const express = require('express');
const router = express.Router();
const SongRequest = require('../models/SongRequest');

// GET route for rendering the song request form
router.get('/song-request', (req, res) => {
    const locals = {
        title: "StrumSpace - Song Request",
        description: "Request your favorite song for guitar chords."
    };
    res.render('song-request', { locals });
});

// POST route for handling form submission
router.post('/song-request', async (req, res) => {
    try {
        const newRequest = new SongRequest({
            songtitle: req.body.songtitle,
            artistBand: req.body['artist-band'],
            ytlink: req.body.ytlink,
            additional: req.body.additional
        });
        await newRequest.save(); // Save to MongoDB
        res.redirect('/thanks'); // Redirect to a thank-you page
    } catch (error) {
        console.log(error);
        res.status(500).send('Error occurred while submitting the request');
    }
});

// GET route for thank you page
router.get('/thanks', (req, res) => {
    const locals = {
        title: "Thank You",
        description: "We have received your song request."
    };
    res.render('thanks', { locals });
});

module.exports = router;
