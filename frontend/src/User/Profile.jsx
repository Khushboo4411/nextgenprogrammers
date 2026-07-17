import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import "./Profile.css";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    profileImage: "",
  });

  const userId = sessionStorage.getItem("userId");

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `https://nextgenprogrammers.onrender.com/UserProfile/${userId}`
      );

      console.log("Profile Data:", res.data);
      console.log("userId:", userId);
console.log(
  `https://nextgenprogrammers.onrender.com/UserProfile/${userId}`
);

      setUser({
        name: res.data.name || "",
        email: res.data.email || "",
        role: res.data.role || "",
        profileImage: res.data.profileImage || "",
      });
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://nextgenprogrammers.onrender.com/UserProfile/${userId}`,
        {
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        }
      );

      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("email", user.email);
      sessionStorage.setItem(
        "profileImage",
        user.profileImage
      );

      alert("Profile Updated Successfully");

      setEditMode(false);

      fetchProfile();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "https://nextgenprogrammers.onrender.com/upload-profile",
        formData
      );

      setUser((prev) => ({
        ...prev,
        profileImage: res.data.imageUrl,
      }));
    } catch (error) {
      console.log(error);
      alert("Image Upload Failed");
    }
  };

  return (
    <>
      <UserNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="user-profile-content">
        <div className="user-profile-card">
          <div className="user-profile-header">
            <img
              src={
                user.profileImage
                  ? user.profileImage
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User"
                    )}`
              }
              alt="User"
              className="user-profile-image"
            />

            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}

            <h2>User Profile</h2>
          </div>

          <div className="user-profile-form">
            <div className="user-profile-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            <div className="user-profile-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            <div className="user-profile-group">
              <label>Role</label>

              <input
                type="text"
                value={user.role}
                disabled
              />
            </div>

            <div className="user-profile-buttons">
              {!editMode ? (
                <button
                  className="user-edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    className="user-save-btn"
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </button>

                  <button
                    className="user-cancel-btn"
                    onClick={() => {
                      setEditMode(false);
                      fetchProfile();
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;