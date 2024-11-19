import React from "react";
import Banner from "./Banner";
import CardsGrid from "./CardGrid";
import volleyball from "../Assets/images/volleyball.jpg"
import cricket from "../Assets/images/cricket.jpg"
import basketball from "../Assets/images/basketball.jpg"

export default function Sports()
{
    const sportsData = [
        {
            image: volleyball,
            title:"Volley Ball",
            description:"Volleyball is a team sport in which two teams of six players are separated by a net."
        },
        {
            image: cricket,
            title:"Cricket",
            description:"The maximum number of players per team is eleven, and the players who participate are decided before the game."
        },
        {
            image: basketball,
            title:"Basket Ball",
            description:"Basketball is a game played between two teams of five players each on a rectangular court, usually indoors."
        },


    ]
    return(
        <>
         <Banner title1="Sports" title2=" "/>
         <CardsGrid cardsData={sportsData} />
        </>
       
        
    );
}