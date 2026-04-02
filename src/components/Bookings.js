// Booking.js
import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings"; // <- Express backend

function Booking() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage(""); // clear previous messages

    try {
      const response = await axios.post(API_URL, { name, service, date, time });
      setMessage(response.data.message); // Should say "Booking successful"
      setName(""); setService(""); setDate(""); setTime(""); // reset form
    } catch (error) {
      console.error(error);
      // Use error from Express backend, not JSON Server
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Booking failed. Make sure backend server is running.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Book a Service</h2>
      <form onSubmit={handleBooking}>
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Service" value={service} onChange={(e) => setService(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <button type="submit">Confirm Booking</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Booking;