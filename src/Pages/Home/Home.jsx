

import React, { useEffect, useState } from "react";
  const [tests, setTests] = useState([]);
import Navbar from "../../Components/NavigationMenu";
  const [testQuery, setTestQuery] = useState("");
import Input from "../../Components/InputFileds";
import "./Home.module.css";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5001/api/doctors");
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data.doctors || []);
      } catch (err) {

    const fetchTests = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/medical-test-prices");
        if (!res.ok) throw new Error("Failed to fetch tests");
        const data = await res.json();
        setTests(data.tests || []);
      } catch (err) {
        console.error("Fetch tests error:", err);
      }
    };

    fetchDoctors();
    fetchTests();
        setError(err.message || "Error fetching doctors");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Real-time filtering as user types in search field
  const filtered = doctors.filter((d) => {
  
  const filteredTests = tests.filter((t) => {
    if (!testQuery.trim()) return true;
    const q = testQuery.toLowerCase();
    return (
      (t.testName && t.testName.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  });
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (d.name && d.name.toLowerCase().includes(q)) ||
      (d.specialization && d.specialization.toLowerCase().includes(q)) ||
      (d.email && d.email.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <Navbar
        links={[
          { label: "Home", to: "/" },
          { label: "About", to: "/about" },
          { label: "Services", to: "/services" },
          { label: "Contact", to: "/contact" },
        ]}
      />

      <div className="heroSection">
        <div className="HeroImage">
          <img src="https://via.placeholder.com/1200x400" alt="Hero Image" />
        </div>

        <div className="doctorData">
          <div className="Searchdoctor">
            <form onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="Search for doctors by name, specialization or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size="lg"
              />
            </form>
          </div>

          <div className="ShowdoctorData">
            {loading && <p className="status-message">Loading doctors...</p>}
            {error && <p className="status-message error-message">{error}</p>}

            {!loading && !error && (
              <div className="doctor-list">
                {filtered.length === 0 && doctors.length > 0 ? (
                  <p className="status-message">No doctors found matching "{query}"</p>
                ) : filtered.length === 0 ? (
                  <p className="status-message">No doctors available.</p>
                ) : (
                  filtered.map((d) => {
                    const imageUrl = d.profilePicture 
                      ? (d.profilePicture.startsWith('http') 
                          ? d.profilePicture 
                          : `http://localhost:5001${d.profilePicture}`)
                      : "https://via.placeholder.com/80";
                    
                    console.log('Doctor:', d.name, 'Image URL:', imageUrl, 'profilePicture:', d.profilePicture);
                    
                    return (
                      <div key={d._id} className="doctor-card">
                        <div className="doctor-card-left">
                          <img
                            src={imageUrl}
                            alt={d.name || "Doctor"}
                            className="doctor-image"
                            onError={(e) => {
                              console.error('Failed to load image:', imageUrl);
                              e.target.src = "https://via.placeholder.com/80";
                            }}
                          />
                        </div>
                        <div className="doctor-card-body">
                          <h3>{d.name || "N/A"}</h3>
                          <p className="specialization">{d.specialization || "Specialist"}</p>
                          <p className="email">{d.email || "N/A"}</p>
                          {d.phone && <p className="phone">Phone: {d.phone}</p>}
        </div>
        
        <div className="testSection">
          <h2>Medical Tests</h2>
          <div className="SearchTests">
            <form onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="Search tests by name, category or description..."
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                size="lg"
              />
            </form>
          </div>

          <div className="ShowTestsData">
            {tests.length === 0 ? (
              <p className="status-message">No tests available.</p>
            ) : (
              <div className="test-list">
                {filteredTests.map((t) => (
                  <div key={t._id} className="test-card">
                    <div className="test-card-body">
                      <h3>{t.testName}</h3>
                      <p className="category">{t.category || 'General'}</p>
                      <p className="description">{t.description || ''}</p>
                      <p className="price">Price: {typeof t.price === 'number' ? `₹${t.price}` : t.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}