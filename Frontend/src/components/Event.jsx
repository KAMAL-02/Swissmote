import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Count from "./Count";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
import FilterEvent from "./FilterEvent";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL;
  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetchEvents();
    } catch (error) {
      console.log("Error:", error.response?.data?.error || error.message);
    }
  }, []);

  // useEffect(() => {
  //   if(!authToken){
  //     navigate("/login");
  //   }
  // }, [authToken, navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/api/event/getEvents`, {
        headers: { Authorization: `${authToken}` },
      });
      console.log("Events:", response.data.events);
      setEvents(response.data.events);
      setFilteredEvents(response.data.events);
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (eventId, isAttending) => {
    if (isAttending) {
      try {
        await axios.delete(`${base_url}/api/event/leaveEvent/${eventId}`, {
          headers: { Authorization: `${authToken}` },
        });
        toast.success("Left event successfully!");
      } catch (error) {
        console.error(
          "Error leaving event:",
          error.response?.data?.message || error.message
        );
        toast.error(error.response?.data?.error || error.message);
      }
    } else {
      try {
        if (!authToken) {
          toast.error("Please login to join an event.");
          navigate("/login");
          return;
        }
        await axios.post(
          `${base_url}/api/event/joinEvent/${eventId}`,
          {},
          { headers: { Authorization: `${authToken}` } }
        );
        toast.success("Joined event successfully!");
      } catch (error) {
        console.error(
          "Error joining event:",
          error.response?.data?.message || error.message
        );
        toast.error(error.response?.data?.error || error.message);
      }
    }
    fetchEvents();
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`${base_url}/api/event/deleteEvent/${eventId}`, {
        headers: { Authorization: `${authToken}` },
      });
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (error) {
      console.error(
        "Error deleting event:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const createEvent = async () => {
    if (!authToken) {
      toast.error("Please login to create an event.");
      navigate("/login");
    } else {
      navigate("/createEvent");
    }
  };

  const logout = () => {
    if (!authToken) {
      navigate("/login");
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-center">Upcoming Events</h1>
          <button
            onClick={createEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md cursor-pointer"
          >
            + Create Event
          </button>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md cursor-pointer"
          >
            {!authToken ? "Login" : "Logout"}
          </button>
        </div>
        <FilterEvent events={events} setFilteredEvents={setFilteredEvents} />
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map((event) => {
              const isAttending = event.attendees.includes(userId);
              const isCreator = event.createdBy._id === userId;
              return (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <img
                    src={event.image || "https://via.placeholder.com/400"}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mt-2">
                      {event.title}
                    </h2>
                    {isCreator && (
                      <button
                        onClick={() => navigate(`/updateEvent/${event._id}`)}
                        className="ml-2 text-blue-500 cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-600">
                    Category: {event.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(event.date).toDateString()}
                  </p>
                  <Count eventId={event._id} />
                  {!isCreator && (
                    <button
                      onClick={() => toggleAttendance(event._id, isAttending)}
                      className={`mt-2 w-full px-4 py-2 rounded-md ${
                        isAttending ? "bg-red-500" : "bg-green-500"
                      } text-white cursor-pointer`}
                    >
                      {isAttending ? "Leave Event" : "Join Event"}
                    </button>
                  )}
                  {isCreator && (
                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer"
                    >
                      Delete Event
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
