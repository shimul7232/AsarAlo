import React, { useEffect, useState } from "react";
import Navbar from "../../Components/NavigationMenu";
import Input from "../../Components/InputFileds";
import axios from "axios";
import "./Home.css";
import DoctorCard from "../../Components/Cards/doctorCards/doctorcard";
import heroImg from"../../assets/Images/hero.png"
import Footer from "../../Components/Footer/footer";
export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [query, setQuery] = useState("");
  const [testQuery, setTestQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
        const [doctorsRes, testsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/doctors`),
          axios.get(`${API_BASE}/api/medical-test-prices`),
        ]);
        setDoctors(doctorsRes.data.doctors || doctorsRes.data || []);
        setTests(testsRes.data.tests || testsRes.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDoctors = doctors.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (d.name || "").toLowerCase().includes(q) ||
      (d.specialization || "").toLowerCase().includes(q) ||
      (d.email || "").toLowerCase().includes(q)
    );
  });

  const filteredTests = tests.filter((t) => {
    const q = testQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (t.testName || "").toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      (t.category || "").toLowerCase().includes(q)
    );
  });

  const backendPrefix = (p) => {
    if (!p) return p;
    if (p.startsWith("http")) return p;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
    return `${API_BASE}${p.startsWith("/") ? p : `/${p}`}`;
  };

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
          <h1>Hospital</h1>
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
                {filteredDoctors.length === 0 && doctors.length > 0 ? (
                  <p className="status-message">No doctors found matching "{query}"</p>
                ) : filteredDoctors.length === 0 ? (
                  <p className="status-message">No doctors available.</p>
                ) : (
                  filteredDoctors.map((d) => {
                    const imageUrl = d.profilePicture ? backendPrefix(d.profilePicture) : "https://via.placeholder.com/80";
                    return (
                      <div key={d._id} className="doctor-card-section">
                        <div className="doctor-card-left">
                          
                        </div>
                        <div className="doctor-card-body">
                          
                          
                          <DoctorCard
                            doctorImage={imageUrl}
                            Name={d.name || "N/A"}
                            Spc={d.specialization || "N/A"}
                            Routin={d.availableDays ? `Available: ${d.availableDays.join(", ")}` : "Availability: N/A"}
                            email={d.email || "N/A"}
                            img={imageUrl}
                            doctorId={d._id}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="testSection">
          <h2>Medical Tests</h2>
          <div className="SearchTests">
            <form onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="Search tests by name, category or description..."
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                size="md"
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
                      <p className="category">{t.category || "General"}</p>
                      <p className="price">Price: {typeof t.price === "number" ? `₹${t.price}` : t.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


            <Footer/>


      </div>
    </div>
  );
}