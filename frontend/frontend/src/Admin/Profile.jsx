import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "./Profile.css";

function AdminProfile() {
  const [editMode, setEditMode] = useState(false);

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    role: "",
    profileImage: "",
  });

  const userId = sessionStorage.getItem("userId");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://nextgenprogrammers.onrender.com/AdminProfile/${userId}`
      );

      setAdmin(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

const handleUpdate = async () => {
  try {
    await axios.put(
      `https://nextgenprogrammers.onrender.com/AdminProfile/${userId}`,
      {
        name: admin.name,
        email: admin.email,
        profileImage: admin.profileImage,
      }
    );

    sessionStorage.setItem(
      "name",
      admin.name
    );

    sessionStorage.setItem(
      "email",
      admin.email
    );

    sessionStorage.setItem(
      "profileImage",
      admin.profileImage
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

    setAdmin({
      ...admin,
      profileImage:
        res.data.imageUrl,
    });

  } catch (error) {
    console.log(error);
    alert("Image Upload Failed");
  }
};



  return (
    <>
      <AdminNavbar />

      <div className="admin-profile-content">

        <div className="profile-card">

         <div className="profile-header">

<img
  src={
    admin.profileImage ||
    `https://ui-avatars.com/api/?name=${admin.name}`
  }
  alt="Admin"
  className="profile-image"
/>

  {editMode && (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
    />
  )}

  <h2>Admin Profile</h2>

</div>

          <div className="profile-form">

            <div className="profile-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={admin.name}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            <div className="profile-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            <div className="profile-group">
              <label>Role</label>

              <input
                type="text"
                value={admin.role}
                disabled
              />
            </div>

            <div className="profile-buttons">

  {!editMode ? (
    <button
      className="edit-btn"
      onClick={() => setEditMode(true)}
    >
      Edit Profile
    </button>
  ) : (
    <>
      <button
        className="save-btn"
        onClick={handleUpdate}
      >
        Save Changes
      </button>

      <button
        className="cancel-btn"
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

export default AdminProfile;