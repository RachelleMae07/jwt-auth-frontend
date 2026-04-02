import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

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

const API_URL = "http://localhost:5000/api/bookings";

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

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    now.setMinutes(minutes + 1);
    const hours = now.getHours().toString().padStart(2, "0");
    const mins = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${mins}`;
  };

  useEffect(() => {
    if (timeInputRef.current) {
      const selectedDate = formData.date;
      if (selectedDate === getTodayDate()) {
        timeInputRef.current.min = getCurrentTime();
      } else {
        timeInputRef.current.min = "00:00";
      }
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
    if (!firstName.trim() || !lastName.trim() || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("Please select a future date.");
      return;
    }

    if (date === getTodayDate()) {
      const now = new Date();
      const [hours, minutes] = time.split(":");
      const selectedTime = new Date();
      selectedTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      if (selectedTime < now) {
        alert("Please select a future time.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const bookingDate = new Date(date).toISOString().split("T")[0];
      const newBooking = {
        firstname: firstName.trim(),
        lastname: lastName.trim(),
        service: selectedService.name,
        price: selectedService.price,
        date: bookingDate,
        time: time,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await axios.post(API_URL, newBooking);
      alert("Booking successful, wait for admin's confirmation.");
      setSelectedService(null);
      setFormData({ firstName: "", lastName: "", date: "", time: "" });
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Booking failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Styles: cards unchanged, modal compact ---
  const containerStyles = {
    minHeight: "calc(100vh - 80px)",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "30px 20px",
    fontFamily: "'Poppins', sans-serif",
  };

  const titleStyles = {
    textAlign: "center",
    fontSize: "2.8rem",
    fontWeight: "700",
    marginBottom: "40px",
    color: "#fff",
    letterSpacing: "1px",
    textShadow: "0 4px 20px rgba(0,0,0,0.5)",
  };

  // Original card grid styles
  const gridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardStyles = {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const imageStyles = {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  };

  const cardContentStyles = {
    padding: "16px",
  };

  const serviceNameStyles = {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#fff",
  };

  const priceStyles = {
    color: "#ff6ec7",
    fontWeight: "600",
  };

  const bookButtonStyles = {
    width: "100%",
    background: "linear-gradient(135deg, #db1bae, #ff69b4)",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "50px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(219,27,174,0.4)",
  };

  // Compact modal styles
  const modalOverlayStyles = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyles = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(25px)",
    borderRadius: "24px",
    padding: "20px",
    width: "100%",
    maxWidth: "320px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.2)",
  };

  const modalTitleStyles = {
    fontSize: "1.4rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "4px",
    background: "linear-gradient(135deg, #ff6ec7, #db1bae)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  const modalPriceStyles = {
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#db1bae",
    marginBottom: "16px",
  };

  const inputGroupStyles = {
    marginBottom: "12px",
  };

  const inputStyles = {
    width: "100%",
    padding: "6px 12px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    outline: "none",
    fontSize: "0.85rem",
    backdropFilter: "blur(10px)",
    boxSizing: "border-box",
  };

  const buttonGroupStyles = {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  };

  const confirmButtonStyles = {
    flex: 1,
    background: "linear-gradient(135deg, #db1bae, #ff69b4)",
    color: "#fff",
    padding: "8px",
    borderRadius: "30px",
    border: "none",
    fontWeight: "500",
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(219,27,174,0.4)",
  };

  const cancelButtonStyles = {
    flex: 1,
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "8px",
    borderRadius: "30px",
    border: "1px solid rgba(255,255,255,0.3)",
    fontSize: "0.85rem",
    cursor: "pointer",
  };

  return (
    <div style={containerStyles}>
      <h2 style={titleStyles}>Our Salon & Spa Services</h2>

      <div style={gridStyles}>
        {services.map((service, i) => (
          <div
            key={i}
            style={cardStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(219,27,174,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={service.image}
              alt={service.name}
              style={imageStyles}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div style={cardContentStyles}>
              <h3 style={serviceNameStyles}>{service.name}</h3>
              <p style={priceStyles}>{service.price}</p>
              <button
                onClick={() => handleBookClick(service)}
                style={bookButtonStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(219,27,174,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div style={modalOverlayStyles} onClick={() => setSelectedService(null)}>
          <form
            onSubmit={handleSubmit}
            style={modalStyles}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={modalTitleStyles}>{selectedService.name}</h3>
            <p style={modalPriceStyles}>{selectedService.price}</p>

            <div style={inputGroupStyles}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                style={inputStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ff6ec7";
                  e.target.style.boxShadow = "0 0 0 2px rgba(255,110,199,0.3)";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
                }}
                required
              />
            </div>

            <div style={inputGroupStyles}>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                style={inputStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ff6ec7";
                  e.target.style.boxShadow = "0 0 0 2px rgba(255,110,199,0.3)";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(250, 243, 243, 0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
                }}
                required
              />
            </div>

            <div style={inputGroupStyles}>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={getTodayDate()}
                style={inputStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ff6ec7";
                  e.target.style.boxShadow = "0 0 0 2px rgba(255,110,199,0.3)";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
                }}
                required
              />
            </div>

            <div style={inputGroupStyles}>
              <input
                type="time"
                name="time"
                ref={timeInputRef}
                value={formData.time}
                onChange={handleInputChange}
                style={inputStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ff6ec7";
                  e.target.style.boxShadow = "0 0 0 2px rgba(255,110,199,0.3)";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
                }}
                required
              />
            </div>

            <div style={buttonGroupStyles}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={confirmButtonStyles}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                style={cancelButtonStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ServicesCrudApp;