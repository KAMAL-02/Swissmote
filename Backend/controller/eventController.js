const Event = require('../model/event');
const authMiddleware = require('../middleware/authMiddleware');


const getEvents = async(req) => {
    try {
        const events = await Event.find({});
        if(!events) return ({error : "No events found"});
        return ({ message: "Events found", events });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

const getEvent = async(req) => {

}

const postEvent = async(req) => {
    const { title, description, date } = req.body;
    console.log(req.user);
    if(!title || !description || !date ) return ({error : "Kindly enter required fields"});

    try {
        const event = await Event.create({ title, description, date, createdBy: req.user.id });
        if(!event) return ({error : "Event not created"});

        return ({ message: "Event created", event });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

const updateEvent = async(req) => {
    const eventId = req.params.eventId;
    if(!eventId) return ({error : "Event Id not found"});

    const { title, description, date } = req.body;

    try {
        const event = await Event.findById(eventId);
        if(!event) return ({error : "Event not found"});

        const newEvent = await Event.findByIdAndUpdate({_id: eventId},
            {
                $set: {
                    title: title,
                    description: description,
                    date: date,
                }
            }
        )
        if(!newEvent) return ({error : "Event not updated"});
        return ({ message: "Event updated", newEvent });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

const deleteEvent = async(req) => {
    
}

module.exports = { getEvents, getEvent, postEvent, updateEvent, deleteEvent };