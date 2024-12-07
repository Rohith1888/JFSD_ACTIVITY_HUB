import React, { useState } from "react";
import axios from "axios";
import "./css/ProfilePage.css";
import background_evening from "../Assets/images/background-evening.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background_night from "../Assets/images/background-night.png";
import background_morning from "../Assets/images/profile-bg-morn.svg";
import background_afternoon from "../Assets/images/background-afternoon.png";

const ProfilePage = ({ user, setUser }) => {
  const [userData, setUserData] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser || {
      fullName: "Default Name",
      email: "default@gmail.com",
      idNumber: "0000000000",
      role: "student",
      points: 0,
      profileImage: "",
      phoneNumber: "0000000000", // Add phone number field here
      batch: "2026", // Default batch
      degree: "B Tech – CSE H", // Default degree
    };
  });

  const [isEditing, setIsEditing] = useState(false);  // State to toggle edit mode
  const [newPhoneNumber, setNewPhoneNumber] = useState(userData.phoneNumber);
  const [newBatch, setNewBatch] = useState(userData.batch);  // Initialize newBatch with userData.batch
  const [newFullName, setNewFullName] = useState(userData.fullName);
  const [newIdNumber, setNewIdNumber] = useState(userData.idNumber);
  const [newDegree, setNewDegree] = useState(userData.degree); // State for degree

  const getCurrentImage = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return background_morning;
    } else if (hour >= 12 && hour < 16) {
      return background_afternoon;
    } else if (hour >= 16 && hour < 19) {
      return background_evening;
    } else {
      return background_night;
    }
  };

  const [newImage, setNewImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result.split(",")[1];
        setNewImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    if (newImage) {
      try {
        const response = await axios.put("http://localhost:8080/student/updateProfile", {
          email: userData.email,
          profileImage: newImage,
          phoneNumber: newPhoneNumber,
          fullName: newFullName,
          idNumber: newIdNumber,
          degree: newDegree,
          batch: newBatch, 
        });

        if (response.status === 200) {
          toast.success("Profile picture updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          const updatedUser = { ...userData, profileImage: newImage };
          setUserData(updatedUser);
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setNewImage(null); // Reset new image state
        } else {
          toast.error("Failed to update profile picture. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error updating profile image:", error);
        toast.error("Failed to update profile picture. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleCancelImage = () => {
    setNewImage(null);
    toast.info("Profile picture update cancelled.", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleEditDetails = () => {
    setIsEditing(true);
  };

  const handleSaveDetails = async () => {
    if (newPhoneNumber||newFullName||newIdNumber||newDegree||newBatch) {
      try {
        const response = await axios.put("http://localhost:8080/student/updateProfile", {
          email: userData.email,
          phoneNumber: newPhoneNumber,
          fullName: newFullName,
          idNumber: newIdNumber,
          degree: newDegree,
          batch: newBatch, 
          profileImage: userData.profileImage,
           // Make sure to update batch as well
        });

        if (response.status === 200) {
          toast.success("Profile  updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          const updatedUser = { ...userData, phoneNumber: newPhoneNumber, fullName: newFullName, idNumber: newIdNumber, degree: newDegree, batch: newBatch };
          setUserData(updatedUser);
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setIsEditing(false); // Turn off edit mode
        } else {
          toast.error("Failed to update profile details. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error updating profile details:", error);
        toast.error("Failed to update profile details. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };
  

  const handleCancelEdit = () => {
    setNewPhoneNumber(userData.phoneNumber);
    setNewFullName(userData.fullName);
    setNewIdNumber(userData.idNumber);
    setNewDegree(userData.degree);
    setNewBatch(userData.batch);
    setIsEditing(false);
  };

  return (
    <div className="container_edit_profile">
      <div className="profile-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="profile-header">
          <img src={getCurrentImage()} alt="Background" />
          <div className="image-upload-container">
            <label htmlFor="file-upload">
              <img
                src={newImage ? `data:image/jpeg;base64,${newImage}` : userData.profileImage ? `data:image/jpeg;base64,${userData.profileImage}` : "avatar.jpg"}
                alt="Profile Avatar"
                className="profile-image"
              />
              <div className="edit-icon">
                <FontAwesomeIcon icon={faEdit} />
              </div>
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
          {newImage && (
            <div className="button-container">
              <button className="save-button" onClick={handleSaveImage}>Save</button>
              <button className="cancel-button" onClick={handleCancelImage}>Cancel</button>
            </div>
          )}
        </div>

        <div className="profile-details">
          <h2 className="name">{isEditing ? (
              <input
                type="text"
                alt="Full Name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="input-edit-center"
                required
              />
            ) : (
              userData.fullName
            )}</h2>
          <p className="email">{userData.email}</p>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <strong>Register Number:    </strong>
            {isEditing ? (
              <input
                type="text"
                value={newIdNumber}
                onChange={(e) => setNewIdNumber(e.target.value)}
              />
            ) : (
              userData.idNumber
            )}
          </div>
          <div className="info-item">
            <strong>Degree:    </strong>
            {isEditing ? (
              <input
                type="text"
                value={newDegree}
                required
                onChange={(e) => setNewDegree(e.target.value)}
              />
            ) : (
              userData.degree? userData.degree : " -"
            )}
          </div>
          <div className="info-item">
            <strong>Batch:    </strong>
            {isEditing ? (
              <input
              required
                type="text"
                value={newBatch}
                onChange={(e) => setNewBatch(e.target.value)}
              />
            ) : (
              userData.batch? userData.batch : " -"
            )}
          </div>
          <div className="info-item">
            <strong>Role:    </strong> {userData.role}
          </div>
          <div className="info-item">
            <strong>Points:    </strong> {userData.points}
          </div>
          <div className="info-item">
            <strong>Phone Number:    </strong>
            {isEditing ? (
              <input
              required
                type="text"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
              />
            ) : (
              userData.phoneNumber? userData.phoneNumber : " -"
            )}
          </div>
        </div>

      </div>
      <div className="edit-section">
        {isEditing ? (
          <div className="edit-buttons">
            <button onClick={handleSaveDetails} className="save-edit-button">Save</button>
            <button onClick={handleCancelEdit} className="cancel-edit-button">Cancel</button>
          </div>
        ) : (
          <button onClick={handleEditDetails} className="edit-edit-button">Edit</button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
