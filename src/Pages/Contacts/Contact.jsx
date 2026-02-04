import "./Contact.css";
import Navbar from "../../Components/NavigationMenu";
import { useAuth } from "../../context/AuthContext";
export default function Contact() {

    const {user}=useAuth()

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
    <div className="contact-page">
<h1>Contact Us</h1>


<form className="contact-form">
<input type="text" placeholder="Your Name" />
<input type="email" placeholder="Your Email" />
<textarea placeholder="Your Message"></textarea>
<button type="submit">Send Message</button>
</form>
</div>
</>
);
}