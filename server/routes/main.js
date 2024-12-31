const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const SongRequest = require('../models/SongRequest');
const { render } = require('ejs');
const { errorMonitor } = require('connect-mongo');
const songRequests = require('./songRequests');

router.use(songRequests);

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "StrumSpace",
            description: ""
        }

        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
        // const data = await Post.find().sort({ createdAt: -1 });

        // res.render('index', {
        //     locals,
        //     data,
        //     currentRoute: '/'
        // });
    } catch (error) {
        console.log(error);
    }
})

/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "StrumSpace ",
        }

        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error);
    }

});

/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Seach",
            description: "StrumSpace "
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        res.render("search", {
            data,
            locals,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }

});


router.get('/songs', async (req, res) => {
    try {
        const locals = {
            title: "StrumSpace-Songs",
            description: ""
        }

        let perPage = 20;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('songs', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }
    // res.render('index',{ locals });
})

router.get('/Metronome', (req, res) => {
    try {
        const locals = {
            title: "StrumSpace-Metronome",
            description: ""
        }
        res.render('metronome', { locals });
    } catch (error) {
        console.log(error);
        

    }
})

router.get('/chord-Chart', (req, res) => {
    try {
        const locals = {
            title: "StrumSpace-Chord Chart",
            description: ""
        }
        res.render('chord-Chart', { locals });
    } catch (error) {
        console.log(error);
    }
})

router.get('/Fret-Notes', (req, res) => {
    try {
        const locals = {
            title: "StrumSpace-Fret Notes",
            description: ""
        }
        res.render('Fret-Notes', { locals });
    } catch (error) {
        console.log(error);
    }
})

// GET route for rendering the song request form
router.get('/song-request', (req, res) => {
    try {
        const locals = {
            title: "StrumSpace - Song Request",
            description: "Request your favorite song for guitar chords."
        };
        res.render('song-request', { locals });
    } catch (error) {
        console.log(error);
    }
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

router.get('/thanks', (req, res) => {
    const locals = {
        title: "Thank You",
        description: "We have received your song request."
    };
    res.render('thanks', { locals });
});

router.get('/about', (req, res) => {
    try {
        const locals = {
            title: "StrumSpace-song request",
            description: ""
        }
        res.render('about', { locals });
    } catch (error) {
        console.log(error);
    }
})

router.get('/error', (req, res) => {
    try {
        const locals = {
            title: "StrumSpace-Error",
            description: ""
        }
        res.render('error', { locals });
    } catch (error) {
        console.log(error);
    }
})




module.exports = router;