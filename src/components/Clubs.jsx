import React from "react";
import Banner from "./Banner";
import CardsGrid from "./CardGrid";
import gdsc from "../Assets/images/gdsc.jpg"
import mayavi from "../Assets/images/mayavi.jpg"
export default function Clubs()
{
    const clubsData =[
        {
            image: gdsc,
            title:"GDSC",
            description:"Google Developer Student Club",
            button_title:"Join Club"
        },
        {
            image: mayavi,
            title:"Mayavi",
            description:"Learn VR and AR ",
            button_title:"Join Club"
        },

    ]
    return(
        <>
         <Banner title1="Clubs" title2=" "/>
         <CardsGrid cardsData={clubsData} />

        </>
    );
}