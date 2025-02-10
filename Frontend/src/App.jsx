import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Event from "./components/Event";
import CreateEvent from "./components/CreateEvent";
import UpdateEvent from "./components/UpdateEvent";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  return (
    <div>
     <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/events" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Event />} />
        <Route path="/createEvent" element={<CreateEvent />} />
        <Route path="/updateEvent/:eventId" element={<UpdateEvent />} />
      </Routes>
     </Router>
     <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
