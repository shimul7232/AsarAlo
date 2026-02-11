import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ users: [], appointments: [], tests: [], doctors: [] });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [showForm, setShowForm] = useState(null); // null, 'users', 'doctors', 'appointments', 'medical-test-prices'
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({});

  // Fetch all data on mount
  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
      console.error('Fetch error:', err);
    }
  };

  const openAddForm = (type) => {
    setShowForm(type);
    setEditingId(null);
    setFormValues({});
    setError(null);
    setSuccess(null);
  };

  const openEditForm = (type, item) => {
    setShowForm(type);
    setEditingId(item._id);
    setFormValues({ ...item });
    setError(null);
    setSuccess(null);
  };

  const closeForm = () => {
    setShowForm(null);
    setEditingId(null);
    setFormValues({});
  };

  const handleInputChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (type) => {
    const errors = [];
    
    if (type === 'doctors') {
      if (!formValues.name?.trim()) errors.push('Name is required');
      if (!formValues.email?.trim()) errors.push('Email is required');
      if (!formValues.specialization?.trim()) errors.push('Specialization is required');
    } else if (type === 'appointments') {
      if (!formValues.patientName?.trim()) errors.push('Patient name is required');
      if (!formValues.patientEmail?.trim()) errors.push('Patient email is required');
      if (!formValues.doctorId?.trim()) errors.push('Doctor is required');
      if (!formValues.appointmentDate) errors.push('Appointment date is required');
      if (!formValues.appointmentTime?.trim()) errors.push('Appointment time is required');
    } else if (type === 'medical-test-prices') {
      if (!formValues.testName?.trim()) errors.push('Test name is required');
      if (!formValues.price || formValues.price <= 0) errors.push('Price must be greater than 0');
      if (!formValues.category?.trim()) errors.push('Category is required');
    } else if (type === 'users') {
      if (!formValues.name?.trim()) errors.push('Name is required');
      if (!formValues.email?.trim()) errors.push('Email is required');
      if (!editingId && !formValues.password?.trim()) errors.push('Password is required');
      if (!formValues.role?.trim()) errors.push('Role is required');
    }
    
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm(showForm);
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setLoading(true);
    try {
      const endpoint = showForm === 'medical-test-prices' ? 'medical-test-prices' : showForm;
      
      let res;
      
      // Handle file upload for doctors with image
      if (showForm === 'doctors' && formValues.profilePicture instanceof File) {
        const formDataToSend = new FormData();
        
        // Add all fields except MongoDB fields and profilePicture
        Object.keys(formValues).forEach(key => {
          if (key !== 'profilePicture' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
            formDataToSend.append(key, formValues[key]);
          }
        });
        
        // Add the file
        formDataToSend.append('profilePicture', formValues.profilePicture);
        
        console.log('Sending FormData with file:', formValues.profilePicture.name);
        
        if (editingId) {
          res = await axios.put(
            `http://localhost:5001/api/${endpoint}/${editingId}`,
            formDataToSend,
            { 
              headers: { 
                Authorization: `Bearer ${user.token}`
                // Let axios handle Content-Type header for FormData
              } 
            }
          );
        } else {
          res = await axios.post(
            `http://localhost:5001/api/${endpoint}`,
            formDataToSend,
            { 
              headers: { 
                Authorization: `Bearer ${user.token}`
                // Let axios handle Content-Type header for FormData
              } 
            }
          );
        }
      } else {
        // For other types or doctors without image
        const cleanData = { ...formValues };
        delete cleanData._id;
        delete cleanData.createdAt;
        delete cleanData.updatedAt;
        delete cleanData.__v;
        
        // Remove profilePicture if it's a string (existing image URL)
        if (typeof cleanData.profilePicture === 'string') {
          delete cleanData.profilePicture;
        }
        
        console.log('Sending JSON data:', cleanData);
        
        if (editingId) {
          res = await axios.put(
            `http://localhost:5001/api/${endpoint}/${editingId}`,
            cleanData,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
        } else {
          res = await axios.post(
            `http://localhost:5001/api/${endpoint}`,
            cleanData,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
        }
      }

      // Update data
      await fetchData();
      
      setSuccess(`${showForm.slice(0, -1).toUpperCase()} ${editingId ? 'updated' : 'added'} successfully!`);
      setError(null);
      closeForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save';
      setError(errorMsg);
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const endpoint = type === 'medical-test-prices' ? 'medical-test-prices' : type;
      await axios.delete(
        `http://localhost:5001/api/${endpoint}/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      await fetchData();
      setSuccess('Item deleted successfully!');
      setError(null);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
      console.error('Delete error:', err);
    }
  };

  const renderFormFields = () => {
    if (!showForm) return null;

    const baseStyle = {
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column'
    };

    const inputStyle = {
      padding: '0.5rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1rem'
    };

    const labelStyle = {
      marginBottom: '0.35rem',
      fontWeight: '500',
      color: '#333'
    };

    if (showForm === 'doctors') {
      return (
        <>
          <div style={baseStyle}>
            <label style={labelStyle}>Name *</label>
            <input
              style={inputStyle}
              type="text"
              value={formValues.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Doctor name"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Email *</label>
            <input
              style={inputStyle}
              type="email"
              value={formValues.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Email address"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Specialization *</label>
            <input
              style={inputStyle}
              type="text"
              value={formValues.specialization || ''}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              placeholder="e.g., Cardiologist"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Experience (years)</label>
            <input
              style={inputStyle}
              type="number"
              value={formValues.experience || ''}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="0"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Phone</label>
            <input
              style={inputStyle}
              type="text"
              value={formValues.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Phone number"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Address</label>
            <input
              style={inputStyle}
              type="text"
              value={formValues.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Address"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Bio</label>
            <textarea
              style={inputStyle}
              value={formValues.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Bio"
              rows="3"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Doctor Image</label>
            <input
              style={{ ...inputStyle, padding: '0.25rem' }}
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange('profilePicture', e.target.files?.[0] || null)}
            />
            {formValues.profilePicture && (
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.35rem' }}>
                ✓ File selected: {typeof formValues.profilePicture === 'string' ? formValues.profilePicture.split('/').pop() : formValues.profilePicture?.name}
              </p>
            )}
          </div>
        </>
      );
    }

    if (showForm === 'appointments') {
      return (
        <>
          <div style={baseStyle}>
            <label style={labelStyle}>Patient Name *</label>
            <input
              style={inputStyle}
              type="text"
              value={formValues.patientName || ''}
              onChange={(e) => handleInputChange('patientName', e.target.value)}
              placeholder="Patient name"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Patient Email *</label>
            <input
              style={inputStyle}
              type="email"
              value={formValues.patientEmail || ''}
              onChange={(e) => handleInputChange('patientEmail', e.target.value)}
              placeholder="Patient email"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Doctor *</label>
            <select
              style={inputStyle}
              value={formValues.doctorId || ''}
              onChange={(e) => handleInputChange('doctorId', e.target.value)}
            >
              <option value="">Select a doctor</option>
              {data.doctors.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Date *</label>
            <input
              style={inputStyle}
              type="date"
              value={formValues.appointmentDate || ''}
              onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Time *</label>
            <input
              style={inputStyle}
              type="time"
              value={formValues.appointmentTime || ''}
              onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Status</label>
            <select
              style={inputStyle}
              value={formValues.status || 'pending'}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea
              style={inputStyle}
              value={formValues.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes"
              rows="2"
            />
          </div>
        </>
      );
    }

    if (showForm === 'medical-test-prices') {
      return (
        <>
          <div style={baseStyle}>
            <label style={labelStyle}>Test Name *</label>
            <input
              style={inputStyle}
              type="text"
              value={formValues.testName || ''}
              onChange={(e) => handleInputChange('testName', e.target.value)}
              placeholder="Test name"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={inputStyle}
              value={formValues.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description"
              rows="2"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Price (BDT) *</label>
            <input
              style={inputStyle}
              type="number"
              value={formValues.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Price"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Category *</label>
            <input
              style={inputStyle}
              type="text"
              value={formValues.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="Category"
            />
          </div>
        </>
      );
    }

    if (showForm === 'users') {
      return (
        <>
          <div style={baseStyle}>
            <label style={labelStyle}>Name *</label>
            <input
              style={inputStyle}
              type="text"
              value={formValues.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="User name"
            />
          </div>
          <div style={baseStyle}>
            <label style={labelStyle}>Email *</label>
            <input
              style={inputStyle}
              type="email"
              value={formValues.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Email"
            />
          </div>
          {!editingId && (
            <div style={baseStyle}>
              <label style={labelStyle}>Password *</label>
              <input
                style={inputStyle}
                type="password"
                value={formValues.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Password"
              />
            </div>
          )}
          <div style={baseStyle}>
            <label style={labelStyle}>Role *</label>
            <select
              style={inputStyle}
              value={formValues.role || ''}
              onChange={(e) => handleInputChange('role', e.target.value)}
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={baseStyle}>
  <label style={labelStyle}>User Image</label>
  <input
    style={{ ...inputStyle, padding: '0.25rem' }}
    type="file"
    accept="image/*"
    onChange={(e) => handleInputChange('profilePicture', e.target.files?.[0] || null)}
  />
  {formValues.profilePicture && (
    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.35rem' }}>
      ✓ File selected: {typeof formValues.profilePicture === 'string' 
        ? formValues.profilePicture.split('/').pop() 
        : formValues.profilePicture?.name}
    </p>
  )}
</div>
        </>
      );
    }

    return null;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name} (Admin)</p>
      <button onClick={logout} style={{ padding: '0.5rem 1rem', marginBottom: '2rem' }}>Logout</button>

      {error && (
        <div style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}
      {success && (
        <div style={{ color: 'green', backgroundColor: '#e6ffe6', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          ✅ {success}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxHeight: '80vh',
            overflowY: 'auto',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>{editingId ? 'Edit' : 'Add'} {showForm.slice(0, -1).toUpperCase()}</h2>
            
            {renderFormFields()}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#0b5fff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={closeForm}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#ccc',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Doctors</h2>
        <button onClick={() => openAddForm('doctors')} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          + Add Doctor
        </button>
        {data.doctors.length === 0 ? (
          <p>No doctors found</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {data.doctors.map(d => (
              <div key={d._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                {d.profilePicture && (
                  <img 
                    src={d.profilePicture.startsWith('http') ? d.profilePicture : `http://localhost:5001${d.profilePicture}`} 
                    alt={d.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
                  />
                )}
                <h3>{d.name}</h3>
                <p><strong>Specialization:</strong> {d.specialization}</p>
                <p><strong>Email:</strong> {d.email}</p>
                {d.phone && <p><strong>Phone:</strong> {d.phone}</p>}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => openEditForm('doctors', d)}
                    style={{ padding: '0.35rem 0.75rem', backgroundColor: '#0b5fff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('doctors', d._id)}
                    style={{ padding: '0.35rem 0.75rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Appointments Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Appointments</h2>
        <button onClick={() => openAddForm('appointments')} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          + Add Appointment
        </button>
        {data.appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.appointments.map(a => (
              <div key={a._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                <p><strong>Patient:</strong> {a.patientName}</p>
                <p><strong>Doctor:</strong> {a.doctorId?.name || 'N/A'}</p>
                <p><strong>Date & Time:</strong> {a.appointmentDate} {a.appointmentTime}</p>
                <p><strong>Status:</strong> {a.status}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => openEditForm('appointments', a)}
                    style={{ padding: '0.35rem 0.75rem', backgroundColor: '#0b5fff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('appointments', a._id)}
                    style={{ padding: '0.35rem 0.75rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Medical Test Prices Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Medical Test Prices</h2>
        <button onClick={() => openAddForm('medical-test-prices')} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          + Add Test Price
        </button>
        {data.tests.length === 0 ? (
          <p>No tests found</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.tests.map(t => (
              <div key={t._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                <p><strong>Test:</strong> {t.testName}</p>
                <p><strong>Price:</strong> {t.price} BDT</p>
                <p><strong>Category:</strong> {t.category}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => openEditForm('medical-test-prices', t)}
                    style={{ padding: '0.35rem 0.75rem', backgroundColor: '#0b5fff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('medical-test-prices', t._id)}
                    style={{ padding: '0.35rem 0.75rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users Section */}
      <section>
        <h2>Users</h2>
        <button onClick={() => openAddForm('users')} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          + Add User
        </button>
        {data.users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.users.map(u => (
              <div key={u._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                <p><strong>Name:</strong> {u.name}</p>
                <p><strong>Email:</strong> {u.email}</p>
                <p><strong>Role:</strong> {u.role}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => openEditForm('users', u)}
                    style={{ padding: '0.35rem 0.75rem', backgroundColor: '#0b5fff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('users', u._id)}
                    style={{ padding: '0.35rem 0.75rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}