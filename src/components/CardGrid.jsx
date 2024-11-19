import React from 'react';
import Card from './Card';
import '../components/css/CardGrid.css';

const CardsGrid = ({ cardsData }) => {
  return (
    <div className="cards-grid">
      {cardsData.map((card, index) => (
        <Card 
          key={index} 
          image={card.image} 
          title={card.title} 
          description={card.description} 
          button_title={card.button_title}
        />
      ))}
    </div>
  );
};

export default CardsGrid;
