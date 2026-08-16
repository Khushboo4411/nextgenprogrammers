import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import axios from "axios";

import UserNavbar from "./UserNavbar";

import "./Profile.css";


function Profile() {

  // ==========================
  // SIDEBAR
  // ==========================

  const [sidebarOpen, setSidebarOpen] =
    useState(true);


  // ==========================
  // EDIT MODE
  // ==========================

  const [editMode, setEditMode] =
    useState(false);


  // ==========================
  // USER DATA
  // ==========================

  const [user, setUser] = useState({

    name: "",

    email: "",

    role: "",

    profileImage: "",

  });


  const userId =
    sessionStorage.getItem("userId");


  // ==========================
  // FETCH PROFILE
  // ==========================

  const fetchProfile = useCallback(
    async () => {

      if (!userId) return;

      try {

        const res = await axios.get(
          `https://nextgenprogrammers.onrender.com/UserProfile/${userId}`
        );


        console.log(
          "Profile Data:",
          res.data
        );

        console.log(
          "User ID:",
          userId
        );


        const profileData = {

          name:
            res.data.name || "",

          email:
            res.data.email || "",

          role:
            res.data.role || "",

          profileImage:
            res.data.profileImage || "",

        };


        // Update React state

        setUser(profileData);


        // =====================================
        // IMPORTANT
        // Update Session Storage
        // =====================================

        sessionStorage.setItem(
          "name",
          profileData.name
        );

        sessionStorage.setItem(
          "email",
          profileData.email
        );

        sessionStorage.setItem(
          "profileImage",
          profileData.profileImage
        );


        // =====================================
        // Tell Navbar about update
        // =====================================

        window.dispatchEvent(
          new Event("profileUpdated")
        );


      } catch (error) {

        console.log(
          "Fetch Profile Error:",
          error
        );

      }

    },
    [userId]
  );


  // ==========================
  // INITIAL PROFILE LOAD
  // ==========================

  useEffect(() => {

    fetchProfile();

  }, [fetchProfile]);


  // ==========================
  // INPUT CHANGE
  // ==========================

  const handleChange = (e) => {

    setUser({

      ...user,

      [e.target.name]:
        e.target.value,

    });

  };


  // ==========================
  // SAVE PROFILE
  // ==========================

  const handleUpdate = async () => {

    try {

      await axios.put(
        `https://nextgenprogrammers.onrender.com/UserProfile/${userId}`,
        {

          name:
            user.name,

          email:
            user.email,

          profileImage:
            user.profileImage,

        }
      );


      // =====================================
      // Update Session Storage
      // =====================================

      sessionStorage.setItem(
        "name",
        user.name
      );

      sessionStorage.setItem(
        "email",
        user.email
      );

      sessionStorage.setItem(
        "profileImage",
        user.profileImage
      );


      // =====================================
      // IMPORTANT
      // Notify Navbar
      // =====================================

      window.dispatchEvent(
        new Event("profileUpdated")
      );


      alert(
        "Profile Updated Successfully"
      );


      setEditMode(false);


      // Get latest profile
      await fetchProfile();


    } catch (error) {

      console.log(
        "Update Profile Error:",
        error
      );

      alert(
        "Update Failed"
      );

    }

  };


  // ==========================
  // IMAGE UPLOAD
  // ==========================

  const handleImageChange = async (e) => {

    const file =
      e.target.files[0];


    if (!file) return;


    // =====================================
    // FormData
    // =====================================

    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );


    try {

      const res =
        await axios.post(
          "https://nextgenprogrammers.onrender.com/upload-profile",
          formData
        );


      console.log(
        "Uploaded Image:",
        res.data
      );


      const imageUrl =
        res.data.imageUrl;


      if (!imageUrl) {

        alert(
          "Image URL not received from server"
        );

        return;

      }


      // =====================================
      // Update Profile State
      // =====================================

      setUser((prev) => ({

        ...prev,

        profileImage:
          imageUrl,

      }));


      // =====================================
      // IMPORTANT
      // Save Image URL in Session Storage
      // =====================================

      sessionStorage.setItem(
        "profileImage",
        imageUrl
      );


      // =====================================
      // IMPORTANT
      // Tell Navbar immediately
      // =====================================

      window.dispatchEvent(
        new Event("profileUpdated")
      );


      console.log(
        "Profile image saved:",
        imageUrl
      );


    } catch (error) {

      console.log(
        "Image Upload Error:",
        error
      );

      alert(
        "Image Upload Failed"
      );

    }

  };


  // ==========================
  // CANCEL EDIT
  // ==========================

  const handleCancel = () => {

    setEditMode(false);

    fetchProfile();

  };


  return (
    <>

      {/* =====================================
          USER NAVBAR
      ====================================== */}

      <UserNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
      />


      {/* =====================================
          PROFILE CONTENT
      ====================================== */}

      <div className="user-profile-content">

        <div className="user-profile-card">


          {/* =====================================
              PROFILE HEADER
          ====================================== */}

          <div className="user-profile-header">


            {/* PROFILE IMAGE */}

            <img
              src={
                user.profileImage
                  ? user.profileImage
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User"
                    )}&background=021049&color=ffffff`
              }
              alt="User"
              className="user-profile-image"
            />


            {/* IMAGE UPLOAD */}

            {editMode && (

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />

            )}


            <h2>
              User Profile
            </h2>

          </div>


          {/* =====================================
              PROFILE FORM
          ====================================== */}

          <div className="user-profile-form">


            {/* NAME */}

            <div className="user-profile-group">

              <label>
                Name
              </label>

              <input
                type="text"
                name="name"
                value={user.name}
                onChange={
                  handleChange
                }
                disabled={
                  !editMode
                }
              />

            </div>


            {/* EMAIL */}

            <div className="user-profile-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={user.email}
                onChange={
                  handleChange
                }
                disabled={
                  !editMode
                }
              />

            </div>


            {/* ROLE */}

            <div className="user-profile-group">

              <label>
                Role
              </label>

              <input
                type="text"
                value={user.role}
                disabled
              />

            </div>


            {/* =====================================
                BUTTONS
            ====================================== */}

            <div className="user-profile-buttons">


              {!editMode ? (

                <button
                  className="user-edit-btn"
                  onClick={() =>
                    setEditMode(true)
                  }
                >
                  Edit Profile
                </button>

              ) : (

                <>

                  {/* SAVE */}

                  <button
                    className="user-save-btn"
                    onClick={
                      handleUpdate
                    }
                  >
                    Save Changes
                  </button>


                  {/* CANCEL */}

                  <button
                    className="user-cancel-btn"
                    onClick={
                      handleCancel
                    }
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

