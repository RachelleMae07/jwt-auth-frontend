import React, { useState, useRef, useEffect } from "react";

// Firebase
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

// Images
import haircut from "../../assets/services/haircut.jpg";
import haircolor from "../../assets/services/haircolor.jpg";
import facial from "../../assets/services/facial.jpg";
import manicure from "../../assets/services/manicure.jpg";
import pedicure from "../../assets/services/pedicure.jpg";
import massage30 from "../../assets/services/massage30.jpeg";
import waxing from "../../assets/services/waxing.jpg";
import hairrebond from "../../assets/services/hair-rebond.jpg";
import bgImage from "../../assets/salon-bg.jpg";

const services = [
  { name: "Hair Cut", price: "₱100", image: haircut },
  { name: "Hair Coloring", price: "₱800", image: haircolor },
  { name: "Facial", price: "₱500", image: facial },
  { name: "Manicure", price: "₱100", image: manicure },
  { name: "Pedicure", price: "₱150", image: pedicure },
  { name: "Massage (30 mins)", price: "₱200", image: massage30 },
  { name: "Waxing", price: "₱250", image: waxing },
  { name: "Hair Rebond", price: "₱1,500", image: hairrebond },
];

function ServicesCrudApp() {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    date: "",
    time: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeInputRef = useRef(null);

  // ✅ TODAY DATE (USED FOR MIN DATE)
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    const hours = now.getHours().toString().padStart(2, "0");
    const mins = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${mins}`;
  };

  useEffect(() => {
    if (timeInputRef.current) {
      timeInputRef.current.min =
        formData.date === getTodayDate() ? getCurrentTime() : "00:00";
    }
  }, [formData.date]);

  const handleBookClick = (service) => setSelectedService(service);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService) {
      alert("Please select a service before booking.");
      return;
    }

    const { firstName, lastName, date, time } = formData;

    if (!firstName || !lastName || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "appointments"), {
        firstname: firstName,
        lastname: lastName,
        service: selectedService.name,
        price: selectedService.price,
        date,
        time,
        status: "pending",
        createdAt: new Date(),
      });

      alert("Booking successful! Wait for confirmation.");

      setSelectedService(null);
      setFormData({
        firstName: "",
        lastName: "",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error(error);
      alert("Booking failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     STYLES (UNCHANGED)
  ========================== */

  const containerStyles = {
    minHeight: "100vh",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "40px 20px",
    fontFamily: "Poppins, sans-serif",
  };

  const titleStyles = {
    textAlign: "center",
    fontSize: "2.8rem",
    fontWeight: "800",
    marginBottom: "40px",
    color: "#fff",
    textShadow: "0 5px 20px rgba(0,0,0,0.5)",
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardStyles = {
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(14px)",
    borderRadius: "22px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    cursor: "pointer",
  };

  const imageStyles = {
    width: "100%",
    height: "190px",
    objectFit: "cover",
  };

  const contentStyles = {
    padding: "16px",
  };

  const nameStyles = {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#fff",
  };

  const priceStyles = {
    color: "#ff4fd8",
    fontWeight: "700",
  };

  const buttonStyles = {
    marginTop: "10px",
    width: "100%",
    padding: "11px",
    borderRadius: "50px",
    border: "none",
    background: "linear-gradient(135deg, #ff4fd8, #ff1493)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  };

  const modalOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalBox = {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    padding: "20px",
    borderRadius: "20px",
    width: "320px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  return (
    <div style={containerStyles}>
      <h2 style={titleStyles}>Our Services</h2>

      <div style={gridStyles}>
        {services.map((service, i) => (
          <div key={i} style={cardStyles}>
            <img src={service.image} alt={service.name} style={imageStyles} />
            <div style={contentStyles}>
              <h3 style={nameStyles}>{service.name}</h3>
              <span style={priceStyles}>{service.price}</span>

              <button style={buttonStyles} onClick={() => setSelectedService(service)}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedService && (
        <div style={modalOverlay}>
          <form style={modalBox} onSubmit={handleSubmit}>
            <h3>{selectedService.name}</h3>

            <input name="firstName" placeholder="First Name" onChange={handleInputChange} />
            <input name="lastName" placeholder="Last Name" onChange={handleInputChange} />

            {/* ✅ FIX: BLOCK PAST DATE HERE */}
            <input
              type="date"
              name="date"
              min={getTodayDate()}
              onChange={handleInputChange}
            />

            <input
              type="time"
              name="time"
              ref={timeInputRef}
              onChange={handleInputChange}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm"}
            </button>

            <button type="button" onClick={() => setSelectedService(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ServicesCrudApp;