import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user data');
      }
    };
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
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
      {userData && (
        <div>
          <h2>Profile</h2>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
          {userData.profilePicture && (
            <div>
              <img src={`http://localhost:5001${userData.profilePicture}`} alt="Profile" width="100" />
            </div>
          )}
          <h3>Upload Profile Picture</h3>
          <form onSubmit={handleUpload}>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
            <button type="submit">Upload</button>
          </form>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}