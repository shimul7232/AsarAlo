import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import BookingModal from "../../Forms/AppionmentBooking/Booking";
import"./doctorCards.css"
export default function DoctorCard({
  Name,
  Spc,
  Routin,
  email,
  doctorId,
  doctorImage
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleBook = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <div className="doctor-card">
        <img src={doctorImage} alt="" srcset="" />
        <h3>{Name}</h3>
        <p>{Spc}</p>
        <p>{Routin}</p>
        <p>{email}</p>

        <button onClick={handleBook}className="Bookingbtn"> Book Appointment</button>
      </div>

      <BookingModal
        show={open}
        onClose={() => setOpen(false)}
        doctorId={doctorId}
        doctorName={Name}
      />
    </>
  );
}
