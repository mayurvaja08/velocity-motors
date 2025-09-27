import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Models() {
  const [bikes, setBikes] = useState([]);
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bikes"));
        const bikesData = [];
        querySnapshot.forEach((doc) => {
          bikesData.push({ id: doc.id, ...doc.data() });
        });
        setBikes(bikesData);

        // Set hero image from first hero bike
        const heroBike = bikesData.find((bike) => bike.hero === true);
        if (heroBike && heroBike.imageUrl) setHeroImage(heroBike.imageUrl);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${
            heroImage || "https://via.placeholder.com/1200x500.png?text=Models+Hero"
          })`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>OUR MODELS</h1>
          <p>Explore our full range of motorcycles and bikes.</p>
        </div>
      </section>

      {/* Featured Models / Grid */}
      <section className="featured">
        <h2>All Models</h2>
        {loading && <p>Loading bikes...</p>}
        <div className="bike-grid">
          {!loading &&
            bikes.map((bike) => (
              <div className="bike-card" key={bike.id}>
                {bike.imageUrl && <img src={bike.imageUrl} alt={bike.name} />}
                <h3>{bike.name}</h3>
                <p>Category: {bike.category}</p>
                <p>Engine: {bike.engine}</p>
                <p>₹{bike.price}</p>
              </div>
            ))}
          {!loading && bikes.length === 0 && <p>No bikes available.</p>}
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
    </>
  );
}

export default Models;
