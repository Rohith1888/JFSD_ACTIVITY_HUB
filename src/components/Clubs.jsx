import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import CardsGrid from "./CardGrid";

export default function Clubs() {
    const [clubsData, setClubsData] = useState([]);
    const [userClubId, setUserClubId] = useState(null);

    // Fetch clubs data
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch("http://localhost:8080/admin/getAllClubs");
                if (!response.ok) {
                    throw new Error(`Failed to fetch clubs: ${response.statusText}`);
                }
                const data = await response.json();
                setClubsData(data);
            } catch (error) {
                console.error("Error fetching clubs data:", error);
            }
        };
        fetchClubs();
    }, []);

    // Fetch user club ID from localStorage and then call API
    useEffect(() => {
        const fetchUserClubId = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (storedUser && storedUser.email) {
                try {
                    const response = await fetch(`http://localhost:8080/student/getClubId/${storedUser.email}`);
                    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch user club ID: ${response.statusText}`);
                    }

                    const data = await response.json();
                    
                    // Check if data is valid
                    setUserClubId(data || null);
                    console.log("Fetched user club ID:", data);
                } catch (error) {
                    console.error("Error fetching user club ID:", error);
                }
            } else {
                console.warn("User not found in localStorage or email missing.");
                setUserClubId(null);
            }
        };

        fetchUserClubId();
    }, []); // Empty dependency array ensures it only runs once when the component mounts.

    return (
        <>
            <Banner title1="Clubs" title2=" " />
            {/* Pass userClubId and clubsData to CardsGrid */}
            <CardsGrid 
                cardsData={clubsData} 
                userClubId={userClubId} 
            />
        </>
    );
}
