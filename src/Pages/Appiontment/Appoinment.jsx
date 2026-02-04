import { useEffect, useState } from "react";
import axios from "axios";
import DoctorCard from "../../Components/Cards/doctorCards/doctorcard";
import Input from "../../Components/InputFileds";
import Navbar from "../../Components/NavigationMenu";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

        const res = await axios.get(`${API_BASE}/api/doctors`);
        setDoctors(res.data.doctors || res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
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

  const backendPrefix = (p) => {
    if (!p) return p;
    if (p.startsWith("http")) return p;
    const API_BASE =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
    return `${API_BASE}${p.startsWith("/") ? p : `/${p}`}`;
  };

  return (
    <>
      <Navbar
        links={[
          { label: "Dashboard", to: "/" },
          { label: "Doctors", to: "/bookAppionment" },
          {label:"About",to: "/about"},
          {label:"Services",to:"/services"},
          { label: "Contact", to: "/contact" },
        ]}
      />
    <br /><br />
      <div className="ShowdoctorData">
        {/* 🔍 Search */}
        <div className="Searchdoctor">
          <Input
            placeholder="Search doctors by name, specialization or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="lg"
          />
        </div>

        {loading && <p className="status-message">Loading doctors...</p>}
        {error && <p className="status-message error-message">{error}</p>}

        {!loading && !error && (
          <div className="doctor-list">
            {filteredDoctors.length === 0 ? (
              <p className="status-message">No doctors found.</p>
            ) : (
              filteredDoctors.map((d) => {
                const imageUrl = d.profilePicture
                  ? backendPrefix(d.profilePicture)
                  : "https://via.placeholder.com/80";

                return (
                  <div key={d._id} className="doctor-card-section">
                    <DoctorCard
                      doctorImage={imageUrl}
                      Name={d.name || "N/A"}
                      Spc={d.specialization || "N/A"}
                      Routin={
                        d.availableDays
                          ? `Available: ${d.availableDays.join(", ")}`
                          : "Availability: N/A"
                      }
                      email={d.email || "N/A"}
                      doctorId={d._id}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}
