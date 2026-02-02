import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      navigate('/user/dashboard'); // New users are 'user' role
    } else {
      setError(result.message);
    }
  };

  return (
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
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}