import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./App.css";

// Import pages
import Models from "./pages/Models";
import Service from "./pages/Service";
import Finance from "./pages/Finance";
import AboutUs from "./pages/AboutUs";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ---------------- HEADER ----------------
function Header({ menuOpen, setMenuOpen, user, handleLogout, openTestRide }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">
        VM <span>Velocity Motors</span>
      </div>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/models" onClick={() => setMenuOpen(false)}>
              Models
            </NavLink>
          </li>
          <li>
            <NavLink to="/service" onClick={() => setMenuOpen(false)}>
              Service
            </NavLink>
          </li>
          <li>
            <NavLink to="/finance" onClick={() => setMenuOpen(false)}>
              Finance
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>
              About Us
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="header-cta">
        {user ? (
          <>
            <button
              className="user-btn"
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "default",
              }}
            >
              {user.name || "User"}
            </button>
            <button
              onClick={handleLogout}
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              backgroundColor: "#343a40",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        )}

        {/* openTestRide called with no bike (null) from header */}
        <button
          className="cta-header"
          onClick={() => openTestRide(null)}
          style={{
            padding: "10px 18px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          BOOK A TEST RIDE
        </button>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>
    </header>
  );
}

// ---------------- FOOTER ----------------
function Footer() {
  return (
    <footer>
      <p>© 2025 Velocity Motors. All rights reserved.</p>
      <p>
        Follow us:
        <a href="#"> Facebook</a> | <a href="#">Instagram</a> |{" "}
        <a href="#">Twitter</a>
      </p>
    </footer>
  );
}

// ---------------- HOME PAGE ----------------
function HomePage({ openTestRideModal }) {
  const [bikes, setBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [heroBikes, setHeroBikes] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bikes"));
        const bikesData = [];
        querySnapshot.forEach((doc) => {
          bikesData.push({ id: doc.id, ...doc.data() });
        });
        setBikes(bikesData);

        const heroes = bikesData.filter((bike) => bike.hero === true);
        setHeroBikes(heroes);
        if (heroes.length > 0) {
          setHeroIndex(Math.floor(Math.random() * heroes.length));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load bikes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  useEffect(() => {
    if (heroBikes.length > 1) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % heroBikes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroBikes]);

  const filteredBikes = bikes.filter(
    (bike) =>
      bike.name?.toLowerCase().includes(search.toLowerCase()) ||
      bike.category?.toLowerCase().includes(search.toLowerCase())
  );

  const currentHero = heroBikes[heroIndex];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero fade-bg"
        style={{
          backgroundImage: currentHero?.imageUrl
            ? `url(${currentHero.imageUrl})`
            : "url('https://via.placeholder.com/1200x500.png?text=No+Hero+Bike')",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content fade-in">
          <h1>UNLEASH YOUR JOURNEY</h1>
          <p>Explore our showroom, performance, and passion.</p>
          <button className="cta-hero">LEARN MORE</button>
        </div>

        {heroBikes.length > 1 && (
          <div className="hero-thumbnails">
            {heroBikes.map((bike, index) => (
              <img
                key={bike.id}
                src={bike.imageUrl}
                alt={bike.name}
                className={`thumbnail ${index === heroIndex ? "active" : ""}`}
                onClick={() => setHeroIndex(index)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Models */}
      <section className="featured">
        <h2>Featured Models</h2>

        <input
          type="text"
          className="search-bar"
          placeholder="Search bikes by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p>Loading bikes...</p>}
        {error && <p className="error">{error}</p>}

        <div className="bike-grid">
          {!loading &&
            !error &&
            filteredBikes.map((bike) => (
              <div
                className="bike-card"
                key={bike.id}
                onClick={() => setSelectedBike(bike)}
              >
                {bike.imageUrl && <img src={bike.imageUrl} alt={bike.name} />}
                <h3>{bike.name}</h3>
                <p>{bike.category}</p>
                <p>Engine: {bike.engine}</p>
                <p>₹{bike.price}</p>
              </div>
            ))}
          {!loading && !error && filteredBikes.length === 0 && (
            <p>No bikes match your search.</p>
          )}
        </div>
      </section>

      {/* Callouts */}
      <section className="callouts">
        <div className="callout">
          <h3>SERVICE & PARTS</h3>
          <p>Maintenance, accessories, and genuine parts.</p>
        </div>
        <div className="callout">
          <h3>FINANCING</h3>
          <p>Flexible financing options to own your dream bike.</p>
        </div>
      </section>

      {/* Bike Modal */}
      {selectedBike && (
        <div className="modal-overlay" onClick={() => setSelectedBike(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedBike(null)}>
              ✖
            </button>
            {selectedBike.imageUrl && (
              <img src={selectedBike.imageUrl} alt={selectedBike.name} />
            )}
            <h2>{selectedBike.name}</h2>
            <p>
              <strong>Category:</strong> {selectedBike.category}
            </p>
            <p>
              <strong>Engine:</strong> {selectedBike.engine}
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedBike.price}
            </p>
            {selectedBike.description && (
              <p>
                <strong>Description:</strong> {selectedBike.description}
              </p>
            )}
            {/* open modal with this bike preselected */}
            <button
              className="cta-modal"
              onClick={() => {
                setSelectedBike(null);
                openTestRideModal(selectedBike);
              }}
            >
              BOOK A TEST RIDE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- MAIN APP ----------------
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState({ mode: "guest" });

  const location = useLocation();

  // ---------------- Test Ride Modal state ----------------
  const [showTestRideModal, setShowTestRideModal] = useState(false);
  const [modalBikes, setModalBikes] = useState([]); // bikes for dropdown
  const [preselectedBike, setPreselectedBike] = useState(null);

  // form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [timeSlot, setTimeSlot] = useState("Morning");
  const [selectedBikeId, setSelectedBikeId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  // location hook for hiding header/footer on auth pages
  // (you already have this above)
  // track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "Users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({ uid: currentUser.uid, ...docSnap.data() });
        } else {
          setUser({ uid: currentUser.uid, name: currentUser.email });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserMode({ mode: "guest" });
  };

  // hide header/footer only on login/register pages
  const hideHeaderFooter =
    location.pathname === "/login" || location.pathname === "/register";

  // open modal helper (null or bike object)
  const openTestRideModal = async (bikeObj) => {
    setPreselectedBike(bikeObj || null);
    setShowTestRideModal(true);
    setSubmitMsg("");
    setFirstName("");
    setLastName("");
    setAge("");
    setCity("");
    setTimeSlot("Morning");
    setNotes("");
    setSelectedBikeId(bikeObj ? bikeObj.id : "");
    setSubmitting(false);

    // fetch bikes for dropdown
    try {
      const q = await getDocs(collection(db, "bikes"));
      const bikesData = [];
      q.forEach((d) => bikesData.push({ id: d.id, ...d.data() }));
      setModalBikes(bikesData);

      // if preselected but not present in fetched list, clear
      if (bikeObj && !bikesData.find((b) => b.id === bikeObj.id)) {
        setSelectedBikeId("");
      }
    } catch (err) {
      console.error("Failed to load bikes for modal", err);
      setModalBikes([]);
    }
  };

  const closeTestRideModal = () => {
    setShowTestRideModal(false);
  };

  const handleSubmitTestRide = async (e) => {
    e.preventDefault();
    setSubmitMsg("");
    if (!user) {
      setSubmitMsg("Please login first to book a test ride");
      return;
    }
    if (!selectedBikeId) {
      setSubmitMsg("Please select a bike");
      return;
    }

    setSubmitting(true);
    try {
      const ridesCol = collection(db, `bikes/${selectedBikeId}/testRides`);
      const payload = {
        firstName,
        lastName,
        age,
        city,
        timeSlot,
        notes,
        userId: user.uid,
        userEmail: user.email || null,
        createdAt: serverTimestamp(),
      };
      await addDoc(ridesCol, payload);

      setSubmitMsg("Test ride booked successfully!");
      // small success UX: clear and auto-close after short delay
      setTimeout(() => {
        setSubmitting(false);
        closeTestRideModal();
      }, 1400);
    } catch (err) {
      console.error("Failed to submit test ride", err);
      setSubmitMsg("Failed to submit. Try again later.");
      setSubmitting(false);
    }
  };

  return (
    <>
      {!hideHeaderFooter && (
        <Header
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          user={user}
          handleLogout={handleLogout}
          openTestRide={openTestRideModal}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<HomePage openTestRideModal={openTestRideModal} />}
        />
        <Route
          path="/login"
          element={<LoginPage setUserMode={setUserMode} />}
        />
        <Route
          path="/register"
          element={<RegisterPage setUserMode={setUserMode} />}
        />
        <Route path="/models" element={<Models />} />
        <Route path="/service" element={<Service />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/adminpage" element={<AdminPage />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}

      {/* ---------------- Test Ride Modal (global) ---------------- */}
      {showTestRideModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={closeTestRideModal}
        >
          <div
            className="modal-content"
            style={{
              width: 520,
              maxWidth: "95%",
              background: "#fff",
              padding: 20,
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Book a Test Ride</h3>
              <button
                onClick={closeTestRideModal}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmitTestRide}>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  style={{ flex: 1, padding: 8 }}
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  style={{ flex: 1, padding: 8 }}
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <input
                  style={{ flex: 1, padding: 8 }}
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  type="number"
                  min="0"
                />
                <input
                  style={{ flex: 1, padding: 8 }}
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Choose Bike
                </label>
                <select
                  value={selectedBikeId}
                  onChange={(e) => setSelectedBikeId(e.target.value)}
                  style={{ width: "100%", padding: 8 }}
                  required
                >
                  <option value="">
                    {preselectedBike ? `Selected: ${preselectedBike.name}` : "Select a bike"}
                  </option>
                  {modalBikes.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — ₹{b.price}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={{ width: "100%", padding: 8 }}
                >
                  <option>Morning (9am - 12pm)</option>
                  <option>Afternoon (12pm - 4pm)</option>
                  <option>Evening (4pm - 7pm)</option>
                </select>
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Additional notes
                </label>
                <textarea
                  placeholder="Anything we should know?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: "100%", padding: 8, minHeight: 80 }}
                />
              </div>

              {submitMsg && (
                <p style={{ marginTop: 10, color: submitMsg.includes("success") ? "green" : "red" }}>
                  {submitMsg}
                </p>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={closeTestRideModal}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!user || submitting}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 6,
                    border: "none",
                    background: !user ? "#ccc" : "#007bff",
                    color: "#fff",
                    cursor: !user ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>

              {!user && (
                <p style={{ marginTop: 8, color: "#c00" }}>
                  Please login first to book a test ride.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
