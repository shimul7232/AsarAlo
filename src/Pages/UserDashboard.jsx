import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../Components/NavigationMenu';  
import './UserDashbroad.css';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/user/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUserData(res.data.user);
        console.log(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user data');
      }
    };
    const ShowuserAppoinments=async()=>{
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
        const res = await axios.get(`${API_BASE}/api/appointments/my`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log(res.data.appointments)
        setUserData(prevData => ({
          ...prevData,
          appointments: res.data.appointments
          
        }));
      } catch (err) {
        console.error('Failed to load appointments', err);
      }
    };
    ShowuserAppoinments();
    fetchUser();
  }, [user.token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await axios.post('http://localhost:5001/api/user/upload-profile-picture', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Profile picture updated');
      setUserData({ ...userData, profilePicture: res.data.profilePicture });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  

  return (
    <>
    <Navbar
        links={[
          { label: "Doctors", to: "/bookAppionment" },
          { label: "About", to: "/about" },
          { label: "Services", to: "/services" },
          { label: "Contact", to: "/contact" },
          { label: "Dashboard", to: "/dashboard" },
        ]}
      />

      <div className="dashboard-content">
        
        {userData?.profilePicture && (
          <div className='profileSection'>
            <img
              src={userData.profilePicture.startsWith('http') ? userData.profilePicture : `http://localhost:5001${userData.profilePicture}`}
              alt="Profile"
              width="150"
            />
            <form onSubmit={handleUpload}>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <button type="submit">Upload Profile Picture</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}  
            <h2>Welcome, {userData?.name || 'User'}!</h2>
            <p>Email: {userData?.email}</p>
          </div>
        )}

        <div className='Appionment-history'>
          <h3>Your Appointment</h3>
          
          {userData?.appointments?.length > 0 ? (
            <ul>
              {userData.appointments.map((appt) => (
                <li key={appt._id}>
                  Dr. {appt.doctorId?.name} - Date:{appt.appointmentDate} - Time:{appt.appointmentTime} - Depertment:{appt.doctorId?.specialization} - Pactain Name :{appt.patientName} - Status :{appt.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments found.</p>
          )}
        </div>

         
      </div>
    
    </>
  );
}