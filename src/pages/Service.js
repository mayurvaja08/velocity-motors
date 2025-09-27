import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Service() {
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const docRef = doc(db, "pages", "service");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroImage(docSnap.data().heroUrl);
        }
      } catch (error) {
        console.error("Error fetching Service hero image:", error);
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
            heroImage || "https://via.placeholder.com/1200x500.png?text=Service+Hero"
          })`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>SERVICE</h1>
          <p>Providing top-notch maintenance and repair services.</p>
        </div>
      </section>

      {/* Services Details */}
      <section className="featured">
        <h2>Our Services</h2>
        <div className="callouts">
          <div className="callout">
            <h3>Regular Maintenance</h3>
            <p>Engine checkups, oil changes, and tuning services.</p>
          </div>
          <div className="callout">
            <h3>Custom Accessories</h3>
            <p>Personalize your bike with genuine accessories.</p>
          </div>
          <div className="callout">
            <h3>Repairs</h3>
            <p>We handle minor and major repairs efficiently.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Service;
