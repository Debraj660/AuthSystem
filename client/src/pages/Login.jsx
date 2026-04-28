import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, message } = useAuth();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      password: form.password,
      ...(form.email ? { email: form.email } : {}),
      ...(form.username ? { username: form.username } : {}),
    };

    const result = await login(payload);
    if (result.success) navigate("/dashboard");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Login</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="username"
            placeholder="Username (optional)"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p>
          Don&apos;t have an account?{" "}
          <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    background: "white",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },
  input: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
  },
  button: {
    padding: 10,
    border: "none",
    borderRadius: 8,
    background: "black",
    color: "white",
    cursor: "pointer",
  },
  message: {
    marginTop: 12,
    color: "green",
  },
};