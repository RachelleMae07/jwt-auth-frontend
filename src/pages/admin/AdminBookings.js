import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

import bgImage from "../../assets/salon-bg.jpg";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, status) => {
    const ref = doc(db, "appointments", id);
    await updateDoc(ref, {
      status,
      updatedAt: new Date(),
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { background: "#ffca28", color: "#000" };
      case "approved":
        return { background: "#4caf50", color: "#fff" };
      case "rejected":
        return { background: "#f44336", color: "#fff" };
      default:
        return { background: "#999", color: "#fff" };
    }
  };

  return (
    <div style={{ marginLeft: "260px", padding: "20px", color: "#fff" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 260,
          width: "calc(100% - 260px)",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          zIndex: -2,
        }}
      />

      <h2>📅 Admin Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            style={{
              background: "rgba(0,0,0,0.7)",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          >
            <h3>{b.service}</h3>
            <p>{b.firstname} {b.lastname}</p>
            <p>{b.date} - {b.time}</p>

            <span style={getStatusStyle(b.status)}>
              {b.status}
            </span>

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => updateStatus(b.id, "approved")}>
                Approve
              </button>

              <button onClick={() => updateStatus(b.id, "rejected")}>
                Reject
              </button>

              <button onClick={() => handleDelete(b.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBookings;