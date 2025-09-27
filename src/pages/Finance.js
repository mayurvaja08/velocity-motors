import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

function Finance() {
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
        console.error("Error fetching Finance hero image:", error);
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
            heroImage || "https://via.placeholder.com/1200x500.png?text=Finance+Hero"
          })`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>FINANCE</h1>
          <p>Flexible plans to help you own your dream bike.</p>
        </div>
      </section>

      {/* Finance Details */}
      <section className="featured">
        <h2>Finance Options</h2>
        <div className="callouts">
          <div className="callout">
            <h3>Loan Plans</h3>
            <p>Low-interest loans with easy EMI options.</p>
          </div>
          <div className="callout">
            <h3>Leasing</h3>
            <p>Affordable lease options for corporate clients.</p>
          </div>
          <div className="callout">
            <h3>Insurance</h3>
            <p>Comprehensive insurance for your bike.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Finance;
