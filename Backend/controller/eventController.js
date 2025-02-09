const Event = require('../model/event');
const router = require('../route/eventRoute');


const getEvents = async(req) => {
    try {
        const events = await Event.find({}).populate('createdBy', 'name email');
        if(!events) return ({error : "No events found"});
        return ({ message: "Events found", events });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

const getEvent = async(req) => {
    const eventId = req.params.eventId;
    if(!eventId) return ({error : "Event Id not found"});

    try {
        const event = await Event.findById(eventId).populate('createdBy', 'name email');
        if(!event) return ({error : "Event not found"});
        return ({ message: "Event found", event });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

const postEvent = async(req) => {
    const { title, description, date } = req.body;
    console.log(req.user);
    if(!title || !description || !date ) return ({error : "Kindly enter required fields"});

    try {
        const event = await (await Event.create({ title, description, date, createdBy: req.user.id })).populate('createdBy', 'name email');

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
    const userId = req.user.id;
    if(!userId) return ({error : "User Id not found"});

    try {
        const event = await Event.findById(eventId);
        if(!event) return ({error : "Event not found"});
        if(event.createdBy != userId) return ({error : "You are not authorized to update this event"});

        const newEvent = await Event.findByIdAndUpdate({_id: eventId},
            {
                $set: {
                    title: title,
                    description: description,
                    date: date,
                }
            }
        ).populate('createdBy', 'name email');
        if(!newEvent) return ({error : "Event not updated"});
        return ({ message: "Event updated", newEvent });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

const deleteEvent = async(req) => {
    const eventId = req.params.eventId;
    if(!eventId) return ({error : "Event Id not found"});

    const userId = req.user.id;
    if(!userId) return ({error : "User Id not found"});

    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId).populate('createdBy', 'name email');
        if(!deletedEvent) return ({error : "Event not deleted"});
        
        if(deletedEvent.createdBy != userId) return ({error : "You are not authorized to delete this event"});

        return ({ message: "Event deleted", deletedEvent });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

const joinEvent = async(req) => {
    const eventId = req.params.eventId;
    if(!eventId) return ({error : "Event Id not found"});

    const userId = req.user.id;
    if(!userId) return ({error : "User Id not found"});

    try {
        const createdEvent = await Event.findById(eventId);
        if(!createdEvent) return ({error : "Event not found"});

        if(createdEvent.createdBy == userId) return ({error : "You cannot join your own event"});
        if(createdEvent.attendees.includes(userId)) return ({error : "You are already attending this event"});

        const updatedEvent = await createdEvent.updateOne({ $push: { attendees: userId } });
        if(!updatedEvent) return ({error : "Event not updated"});

        return ({ message: "You have joined the event", updatedEvent });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

const leaveEvent = async(req) => {
    const eventId = req.params.eventId;
    if(!eventId) return ({error : "Event Id not found"});

    const userId = req.user.id;
    if(!userId) return ({error : "User Id not found"});

    try {
        const leaveEvent = await Event.findById(eventId);
        if(!leaveEvent) return ({error : "Event not found"});

        if(leaveEvent.createdBy == userId) return ({error : "You cannot leave your own event"});
        if(!leaveEvent.attendees.includes(userId)) return ({error : "You are not attending this event"});

        const updatedEvent = await leaveEvent.updateOne({ $pull: { attendees: userId } });
        if(!updatedEvent) return ({error : "Event not updated"});

        return ({ message: "You have left the event", updatedEvent });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

module.exports = { getEvents, getEvent, postEvent, updateEvent, deleteEvent, joinEvent, leaveEvent };