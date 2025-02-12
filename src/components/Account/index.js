import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./index.css"; // Import styles

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);

  // Fetch user profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = Cookies.get("jwt_token");

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/profile`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setProfile(response.data);
        setUpdatedProfile(response.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleUpdate = async () => {
    setLoading(true);
    const token = Cookies.get("jwt_token");

    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      // Decode JWT token to get user ID
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/${userId}`,
        updatedProfile,
        {
          headers: { Authorization: `${token}` },
        }
      );

      setProfile({ data: updatedProfile });
      setEditMode(false);
      setSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    );

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="account-container">
      <h2>Account Details</h2>

      {successMessage && (
        <div className="success-popup">
          ✔ Profile Updated Successfully!
        </div>
      )}

      {profile && (
        <div className="profile-details">
          <label>Name:</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={updatedProfile.name}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.data.name}</p>
          )}

          <label>Email:</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.data.email}</p>
          )}

          <label>Mobile Number:</label>
          {editMode ? (
            <input
              type="text"
              name="mobile_number"
              value={updatedProfile.mobile_number}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.data.mobile_number}</p>
          )}

          <label>User Type:</label>
          <p>{profile.data.usertype}</p>

          {editMode ? (
            <button className="update-btn" onClick={handleUpdate}>
              Save Changes
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Account;
