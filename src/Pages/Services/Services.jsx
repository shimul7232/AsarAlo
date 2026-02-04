import "./Services.css";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../Components/NavigationMenu";
export default function Services() {

    const{user}=useAuth()

return (
<>
        <Navbar
        links={[
  user ? { label: "Dashboard", to: "/user/dashboard" } : { label: "Home", to: "/" },
  ...(user ? [{ label: "Doctors", to: "/bookAppionment" }] : []),
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" }
]}/>
<div className="services-page">
<h1>Our Services</h1>


<div className="services-grid">
<div className="service-card">🩺 General Consultation</div>
<div className="service-card">🧪 Diagnostic Tests</div>
<div className="service-card">🚑 Emergency Care</div>
<div className="service-card">👶 Child Care</div>
<div className="service-card">❤️ Cardiology</div>
<div className="service-card">🦷 Dental Care</div>
</div>
</div>
</>
);
}