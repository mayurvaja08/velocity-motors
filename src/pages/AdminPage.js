// pages/AdminPage.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBikeId, setCurrentBikeId] = useState(null);
  const [bikeForm, setBikeForm] = useState({
    name: "",
    price: "",
    imageUrl: "",
    hero: false,
    engine: "",
    category: "",
  });
  const [notification, setNotification] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "bikes"));
      const bikesData = [];
      querySnapshot.forEach((doc) => {
        bikesData.push({ id: doc.id, ...doc.data() });
      });
      setBikes(bikesData);
    } catch (error) {
      console.error("Error fetching bikes:", error);
      showNotification("Failed to fetch bikes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBikeForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveBike = async () => {
    if (!bikeForm.name || !bikeForm.price || !bikeForm.imageUrl) {
      showNotification("Please fill name, price, and image URL", "error");
      return;
    }

    try {
      if (editMode) {
        // Update existing bike
        const bikeRef = doc(db, "bikes", currentBikeId);
        await updateDoc(bikeRef, bikeForm);
        showNotification("Bike updated successfully!", "success");
      } else {
        // Add new bike
        await addDoc(collection(db, "bikes"), bikeForm);
        showNotification("Bike added successfully!", "success");
      }
      setModalOpen(false);
      setEditMode(false);
      setCurrentBikeId(null);
      setBikeForm({
        name: "",
        price: "",
        imageUrl: "",
        hero: false,
        engine: "",
        category: "",
      });
      fetchBikes();
    } catch (error) {
      console.error("Error saving bike:", error);
      showNotification("Failed to save bike", "error");
    }
  };

  const handleEditBike = (bike) => {
    setBikeForm({
      name: bike.name,
      price: bike.price,
      imageUrl: bike.imageUrl,
      hero: bike.hero || false,
      engine: bike.engine || "",
      category: bike.category || "",
    });
    setCurrentBikeId(bike.id);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteBike = async (id) => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      try {
        await deleteDoc(doc(db, "bikes", id));
        fetchBikes();
        showNotification("Bike deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting bike:", error);
        showNotification("Failed to delete bike", "error");
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Notification */}
      {notification.message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            color: notification.type === "success" ? "green" : "red",
            border: `1px solid ${notification.type === "success" ? "green" : "red"}`,
            borderRadius: "5px",
          }}
        >
          {notification.message}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin Dashboard</h1>
        <div>
          <button
            onClick={() => navigate("/")}
            style={{ marginRight: "10px", padding: "10px 20px" }}
          >
            Home
          </button>
          <button
            onClick={() => {
              setModalOpen(true);
              setEditMode(false);
              setBikeForm({
                name: "",
                price: "",
                imageUrl: "",
                hero: false,
                engine: "",
                category: "",
              });
            }}
            style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff" }}
          >
            Add Bike
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>{editMode ? "Edit Bike" : "Add New Bike"}</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={bikeForm.name}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={bikeForm.price}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={bikeForm.imageUrl}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              name="engine"
              placeholder="Engine"
              value={bikeForm.engine}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={bikeForm.category}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <label style={{ display: "block", marginBottom: "10px" }}>
              Hero:
              <input
                type="checkbox"
                name="hero"
                checked={bikeForm.hero}
                onChange={handleInputChange}
                style={{ marginLeft: "10px" }}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button onClick={() => setModalOpen(false)}>Cancel</button>
              <button onClick={handleSaveBike} style={{ backgroundColor: "#007bff", color: "#fff" }}>
                {editMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bikes Grid */}
      <div style={{ marginTop: "20px" }}>
        {loading ? (
          <p>Loading bikes...</p>
        ) : bikes.length === 0 ? (
          <p>No bikes available.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {bikes.map((bike) => (
              <div
                key={bike.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  width: "220px",
                  overflow: "hidden",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={bike.imageUrl}
                  alt={bike.name}
                  style={{ width: "100%", height: "140px", objectFit: "cover" }}
                />
                <div style={{ padding: "10px" }}>
                  <h3>{bike.name}</h3>
                  <p>₹{bike.price}</p>
                  <p>{bike.category}</p>
                  <p>{bike.engine}</p>
                  {bike.hero && (
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "#ffc107",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Hero
                    </span>
                  )}
                  <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                    <button
                      onClick={() => handleEditBike(bike)}
                      style={{
                        flex: 1,
                        padding: "5px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBike(bike.id)}
                      style={{
                        flex: 1,
                        padding: "5px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
