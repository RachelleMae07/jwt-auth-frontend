import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import bgImage from "../../assets/salon-bg.jpg";

function Notifications() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          zIndex: -1,
        }}
      />

      <h2>🔔 Notifications</h2>

      {bookings.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            style={{
              background: "rgba(0,0,0,0.6)",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          >
            <p>{b.service}</p>
            <p>Status: {b.status}</p>
            <p>{b.date} {b.time}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;