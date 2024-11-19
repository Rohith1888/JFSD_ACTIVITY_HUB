import React from "react";
import "../components/css/banner.css";

export default function Banner({title1="Welcome to Activity", title2="Hub"}) {
    return (
        <div class="banner">
  <div class="bubble small"></div>
  <div class="bubble medium"></div>
  <div class="bubble large"></div>
  <div class="bubble xlarge"></div>
  <div class="bubble xxlarge"></div>
  <div class="banner__text">
    <span>{title1}</span>
    <span>{title2}</span>
    
  </div>
</div>
    );
}
