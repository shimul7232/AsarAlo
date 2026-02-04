import "./About.css";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../Components/NavigationMenu";
export default function About() {

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

        <div className="about-page">
<section className="about-hero">
<h1>About Our Hospital</h1>
<p>Trusted healthcare with modern technology and compassionate care.</p>
</section>


<section className="about-content">
<div className="about-card">
<h3>Our Mission</h3>
<p>
To provide high-quality, affordable healthcare services using modern
medical technology.
</p>
</div>


<div className="about-card">
<h3>Our Vision</h3>
<p>
Becoming a leading healthcare provider with patient-first values.
</p>
</div>


<div className="about-card">
<h3>Why Choose Us</h3>
<p>
Experienced doctors, advanced labs, and 24/7 emergency services.
</p>
</div>
</section>
</div>
        </>

);
}