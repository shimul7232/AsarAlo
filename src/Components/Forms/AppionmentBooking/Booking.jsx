import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Booking.css";

export default function BookingModal({ show, onClose, doctorId, doctorName }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patientName: user?.name || "",
    patientEmail: user?.email || "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);
    setMessage("");

    try {
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

      const token = user?.token || localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, doctorId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✓ Appointment booked successfully");
        setTimeout(onClose, 1500);
      } else {
        setMessage(data.message || "Booking failed");
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setBooking(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Appointment with {doctorName}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Patient Name"
            required
          />

          <input
            name="patientEmail"
            value={formData.patientEmail}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
          />

          {message && (
            <p className={message.includes("✓") ? "success" : "error"}>{message}</p>
          )}

          <button disabled={booking}>
            {booking ? "Booking..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
