import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../../assets/salon-bg.jpg";

const API_URL = "http://localhost:5000/api/bookings";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({ date: "", time: "" });

  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_URL);
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    const updatedBooking = { ...booking, status, updatedAt: new Date().toISOString() };
    try {
      await axios.put(`${API_URL}/${id}`, updatedBooking);
      setBookings(prev => prev.map(b => (b.id === id ? updatedBooking : b)));
    } catch (err) { console.error(err); alert("Status update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) { console.error(err); alert("Delete failed"); }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setEditFormData({ date: booking.date, time: booking.time });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const isValidDateTime = (date, time) => {
    const selected = new Date(`${date}T${time}`);
    const now = new Date();
    if (selected < now) { alert("Cannot select past date/time."); return false; }
    return true;
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;
    const { date, time } = editFormData;
    if (!isValidDateTime(date, time)) return;
    const updatedBooking = { ...editingBooking, date, time, updatedAt: new Date().toISOString() };
    try {
      await axios.put(`${API_URL}/${editingBooking.id}`, updatedBooking);
      setBookings(prev => prev.map(b => (b.id === editingBooking.id ? updatedBooking : b)));
      setIsEditModalOpen(false);
      setEditingBooking(null);
    } catch (err) { console.error(err); alert("Edit failed"); }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        .admin-bookings-container { margin-left: 260px; width: calc(100% - 260px); min-height: 100vh; position: relative; font-family: 'Poppins', sans-serif; color: #fff; padding: 20px; }
        .bg-image { position: fixed; top: 0; left: 260px; width: calc(100% - 260px); height: 100%; background-size: cover; background-position: center; filter: brightness(0.5); z-index: -2; }
        .overlay { position: fixed; top: 0; left: 260px; width: calc(100% - 260px); height: 100%; background-color: rgba(0,0,0,0.6); z-index: -1; }
        .content-card { max-width: 1400px; margin: 30px auto; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); border-radius: 24px; padding: 24px; }
        .table-wrapper { overflow-x: auto; border-radius: 20px; }
        .booking-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .booking-table th, .booking-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .status-badge { padding: 6px 14px; border-radius: 40px; font-size: 0.8rem; font-weight: 600; text-align: center; min-width: 100px; display: inline-block; }
        .actions-cell { display: flex; gap: 8px; flex-wrap: wrap; }
        .action-btn { border: none; padding: 6px 14px; border-radius: 30px; color: #fff; font-weight: 500; font-size: 0.75rem; cursor: pointer; background: rgba(255,255,255,0.2); transition: 0.2s; }
        .action-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #1e1e2a; border-radius: 20px; padding: 24px; width: 90%; max-width: 500px; color: #fff; }
        .modal-content h3 { color: #ffca28; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; }
        .form-group input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: #fff; }
        .form-group input:focus { outline: none; border-color: #ffca28; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .modal-btn { padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: 0.2s; }
        .modal-btn.save { background: #4caf50; color: white; }
        .modal-btn.cancel { background: #f44336; color: white; }
        .modal-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }

        @media (max-width: 768px) {
          .admin-bookings-container { margin-left: 0; width: 100%; padding: 15px; }
          .bg-image, .overlay { left: 0; width: 100%; }
          .booking-table { min-width: 100%; font-size: 0.85rem; }
          .booking-table th, .booking-table td { padding: 10px 8px; }
          .actions-cell { flex-direction: column; gap: 6px; }
          .action-btn { font-size: 0.7rem; padding: 4px 8px; }
        }

        @media (max-width: 480px) {
          .booking-table th:nth-child(3), .booking-table td:nth-child(3),
          .booking-table th:nth-child(5), .booking-table td:nth-child(5) { display: none; }
        }
      `}</style>

      <div className="admin-bookings-container">
        <div className="bg-image" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="overlay" />

        <div className="content-card">
          <h2>📅 All Bookings</h2>
          {loading && <div>Loading bookings...</div>}
          {error && <div>{error}</div>}
          {!loading && !error && (
            <div className="table-wrapper">
              {bookings.length === 0 ? (
                <div>No bookings available.</div>
              ) : (
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Price</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td>{b.firstname} {b.lastname}</td>
                        <td>{b.service}</td>
                        <td>{b.price}</td>
                        <td>{b.date}</td>
                        <td>{b.time}</td>
                        <td><span className="status-badge" style={getStatusStyle(b.status)}>{b.status}</span></td>
                        <td className="actions-cell">
                          <button onClick={() => updateStatus(b.id, "approved")} className="action-btn" style={{background:"#4caf50"}}>✓ Approve</button>
                          <button onClick={() => updateStatus(b.id, "rejected")} className="action-btn" style={{background:"#f44336"}}>✗ Reject</button>
                          <button onClick={() => handleEdit(b)} className="action-btn" style={{background:"#2196f3"}}>✏️ Edit</button>
                          <button onClick={() => handleDelete(b.id)} className="action-btn" style={{background:"#ff9800"}}>🗑 Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Booking</h3>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={editFormData.date} onChange={handleEditChange} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" value={editFormData.time} onChange={handleEditChange} />
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className="modal-btn save" onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper to style status badge
function getStatusStyle(status) {
  const s = status.toLowerCase();
  if (s === "pending") return { background: "#ffca28", color: "#000" };
  if (s === "approved") return { background: "#4caf50", color: "#fff" };
  if (s === "rejected") return { background: "#f44336", color: "#fff" };
  if (s === "rescheduled") return { background: "#2196f3", color: "#fff" };
  return { background: "#999", color: "#fff" };
}

export default AdminBookings;