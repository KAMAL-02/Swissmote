import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;
const socket = io(base_url);

const Count = ({ eventId }) => {
    const [attendeeCount, setAttendeeCount] = useState(0);

    // Fetch initial count and setup socket listener
    useEffect(() => {
        const fetchInitialCount = async () => {
            try {
                const response = await axios.get(`${base_url}/api/event/getEvent/${eventId}`);
                console.log("response is", response.data);
                console.log("Attendees:", response.data.event.attendees);
                setAttendeeCount(response.data.event.attendees.length);
            } catch (error) {
                console.error("Error fetching attendee count:", error);
            }
        };

        fetchInitialCount();

        const handleCountUpdate = ({ eventId: updatedId, attendees }) => {
            if (updatedId === eventId) setAttendeeCount(attendees);
        };

        socket.on("attendeeCountUpdated", handleCountUpdate);

        return () => {
            socket.off("attendeeCountUpdated", handleCountUpdate);
        };
    }, [eventId]);

    return (
        <div className="p-4 border rounded-lg shadow-md text-center">
            <span className="font-semibold">Attendee:</span>
            <span className="ml-2 text-blue-600 font-bold">{attendeeCount}</span>
        </div>
    );
};

export default Count;
