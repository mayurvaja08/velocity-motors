import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

function AboutUs() {
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        // Query bikes collection to get first bike with hero=true
        const q = query(collection(db, "bikes"), where("hero", "==", true), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const bike = querySnapshot.docs[0].data();
          if (bike.imageUrl) setHeroImage(bike.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching About hero image:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroImage();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${
            heroImage || "https://via.placeholder.com/1200x500.png?text=About+Us+Hero"
          })`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>ABOUT US</h1>
          <p>Learn more about Velocity Motors and our journey.</p>
        </div>
      </section>

      {/* Company Info */}
      <section className="featured">
        <h2>Our Story</h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "0 auto 20px",
            textAlign: "center",
          }}
        >
          Velocity Motors has been delivering high-performance motorcycles and
          outstanding customer experiences since 2005.
        </p>

        <div className="callouts">
          <div className="callout">
            <h3>Our Mission</h3>
            <p>
              To provide premium motorcycles and unmatched service to
              enthusiasts worldwide.
            </p>
          </div>
          <div className="callout">
            <h3>Our Vision</h3>
            <p>
              To become the most trusted and admired motorcycle brand in the
              country.
            </p>
          </div>
          <div className="callout">
            <h3>Our Values</h3>
            <p>Passion, Performance, Integrity, and Customer Delight.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutUs;
