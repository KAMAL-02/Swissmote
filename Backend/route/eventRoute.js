const express = require('express');
const router = express.Router();
const { getEvents, getEvent, postEvent, updateEvent, deleteEvent } = require('../controller/eventController');
const authMiddleware = require('../middleware/authMiddleware');

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

router.get("/getEvent", (req, res) => {
    res.json({message: "Get Event"})
})

router.post("/createEvent", authMiddleware, (req, res) => {
    postEvent(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    });
})

router.put("/updateEvent/:eventId",authMiddleware, (req, res) => {
    updateEvent(req)
    .then((response) => {
        if(response.error) return res.status(400).json({...response});
        res.status(200).json({...response});
    })
    .catch((error) => {
        res.status(400).json({...error});
    });
})

router.delete("/deleteEvent",authMiddleware, (req, res) => {
    res.json({message: "Delete Event"})
})
module.exports = router;