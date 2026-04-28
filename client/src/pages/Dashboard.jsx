import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, logoutAllDevices, refreshAccessToken, message, loading } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) navigate("/login");
  };

  const handleLogoutAll = async () => {
    const result = await logoutAllDevices();
    if (result.success) navigate("/login");
  };

  const handleRefresh = async () => {
    const result = await refreshAccessToken();
    alert(result.success ? "Token refreshed" : result.message);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Dashboard</h2>
        <p>You are logged in.</p>

        <div style={styles.actions}>
          <button onClick={handleRefresh} style={styles.button} disabled={loading}>
            Refresh Token
          </button>
          <button onClick={handleLogout} style={styles.button} disabled={loading}>
            Logout
          </button>
          <button onClick={handleLogoutAll} style={styles.button} disabled={loading}>
            Logout All Devices
          </button>
        </div>

        {message && <p style={styles.message}>{message}</p>}
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
    maxWidth: 500,
    padding: 24,
    borderRadius: 12,
    background: "white",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 16,
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 14px",
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