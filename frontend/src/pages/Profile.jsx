
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h1>My Profile</h1>
        <p className="profile-subtitle">Your account information</p>

        <div className="profile-details">
          <div>
            <label>Full Name</label>
            <p>{user?.name}</p>
          </div>

          <div>
            <label>Email Address</label>
            <p>{user?.email}</p>
          </div>

          <div>
            <label>Account Role</label>
            <p>{user?.role}</p>
          </div>
        </div>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Profile;
