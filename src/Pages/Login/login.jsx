import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = await login(email, password, isAdmin);
    if (result.success) {
      setSuccess("Login successful");
      navigate(result.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label><br />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /><br />

        <label>Password</label><br />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /><br />

        

        <input type="submit" value="Login" /><br />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p>Don't have an account? <a href="/register">Register</a></p>
    </>
  );
}
