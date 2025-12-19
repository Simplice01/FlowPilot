import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login as apiLogin } from "../api/authService";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiLogin({ username, password });
      login(res.access, res.refresh);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Identifiants incorrects");
    }
  };

  return (
<div className="page form-page">
  <div className="card form-wrapper">

    <h2 style={{ marginBottom: 16 }}>Connexion</h2>

    {error && (
      <div
        style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "10px 12px",
          borderRadius: 8,
          marginBottom: 12,
          fontSize: 14,
        }}
      >
        {error}
      </div>
    )}

    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nom d’utilisateur</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Se connecter
      </button>
    </form>
  </div>
</div>

  );
}
