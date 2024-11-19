import React from "react";
import Banner from "./Banner";
import CardsGrid from "./CardGrid";
import '../components/css/events.css';
import flutter from '../Assets/images/flutter.jpg'
import genai from '../Assets/images/genai.jpg'
import gamedev from '../Assets/images/gamedev.jpg'
import webdev from '../Assets/images/webdev.jpg'
import data from '../Assets/images/data.jpg'
import wordpress from '../Assets/images/wordpress.jpg'
import food from '../Assets/images/food.jpg'
import standup from '../Assets/images/standup.jpg'
import social from '../Assets/images/social.jpg'
import photography from '../Assets/images/photography.jpg'
import arts from '../Assets/images/arts.jpg'

export default function Events() {
  const technicalEvents = [
    {
      image: flutter,
      title: 'Flutter',
      description: 'Flutter is Google\'s UI toolkit for building natively compiled applications for mobile, web, and desktop.',
    },
    {
      image: genai,
      title: 'Gen AI',
      description: 'Gen AI can generate convincingly authentic images, videos, and audio of real people.',
    },
    {
        image: gamedev,
        title: 'Game Development',
        description: 'Game development, production, or design is a process that starts from an idea or concept.',
      },
      {
        image: webdev,
        title: 'Web Development',
        description: 'Web development refers to the overall process of creating websites or web applications.',
      },
      {
        image: data,
        title: 'Dive into Data Science',
        description: 'Data science combines tools, methods, and technology to generate meaning from data.',
      },
      {
        image: wordpress,
        title: 'Word Press',
        description: 'WordPress is a free, open-source website creation platform.',
      },
    // Add more technical events here
  ];

  const nonTechnicalEvents = [
    {
      image: food,
      title: 'Food',
      description: 'Competitive eating in which participants compete against each other to eat large quantities of food in a short time period.',
    },
    {
      image: standup,
      title: 'Standup Comedy',
      description: 'Stand-up comedy is a performance directed to a live audience, where the performer stands on a stage and delivers humorous.',
    },
    {
        image: social,
        title: 'Social Service',
        description: 'Social services are a range of public services intended to provide support and assistance towards particular groups.',
      },
      {
        image: photography,
        title: 'Photography',
        description: 'Photography is about capturing light, and exposure is so important because it is the amount of light collected by your camera.',
      },
      {
        image: arts,
        title: 'Arts and Crafts',
        description: 'Arts and crafts describes a wide variety of activities involving making things with on own hands',
      },
    // Add more non-technical events here
  ];

  return (
    <>
      <Banner title1="Events" title2=" " />
      <h2 className="center-heading">Technical Events</h2>
      <CardsGrid cardsData={technicalEvents} />
      <h2 className="center-heading">Non Technical Events</h2>
      <CardsGrid cardsData={nonTechnicalEvents} />
    </>
  );
}
