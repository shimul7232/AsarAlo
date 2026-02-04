import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../Components/NavigationMenu";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = await register(name, email, password);
    if (result.success) {
      setSuccess("Registration successful");
      navigate('/user/dashboard'); 
    } else {
      setError(result.message);
    }
  };
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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label><br />
        <input type="text" value={name} onChange={e => setName(e.target.value)} required /><br />

        <label>Email</label><br />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /><br />

        <label>Password</label><br />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /><br />

        <input type="submit" value="Register" /><br />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
    </>
  );
}