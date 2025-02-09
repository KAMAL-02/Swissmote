const express = require('express');
const router = express.Router();
const { getEvents, getEvent, postEvent, updateEvent, deleteEvent, joinEvent, leaveEvent } = require('../controller/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../upload');

router.get("/getEvents", (req, res) => {
    getEvents(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    })
})

router.get("/getEvent/:eventId", (req, res) => {
    getEvent(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    })
})

router.post("/createEvent", authMiddleware, upload.single('image'), (req, res) => {
    postEvent(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    });
})

router.put("/updateEvent/:eventId",authMiddleware, upload.single('image'), (req, res) => {
    updateEvent(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    });
})

router.delete("/deleteEvent/:eventId",authMiddleware, (req, res) => {
    deleteEvent(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    });
})

router.post("/joinEvent/:eventId",authMiddleware, (req, res) => {
    joinEvent(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    });
})

router.delete("/leaveEvent/:eventId",authMiddleware, (req, res) => {
    leaveEvent(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    });
})
module.exports = router;