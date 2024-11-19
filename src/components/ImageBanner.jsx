import React from "react";
import "../components/css/image.css"; // Link to the stylesheet

export default function ImageBanner({ src, alt }) {
  return (
    <div className="image-container">
      <img src={src} alt={alt} className="responsive-image" />
    </div>
  );
}
