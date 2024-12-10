import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import CardsGrid from "./CardGrid";

export default function Clubs() {
    const [clubsData, setClubsData] = useState([]);
    const [userClubId, setUserClubId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch clubs data
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch("https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllClubs");
                if (!response.ok) {
                    throw new Error(`Failed to fetch clubs: ${response.statusText}`);
                }
                const data = await response.json();
                setClubsData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching clubs data:", error);
                setLoading(false);
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
                    const response = await fetch(`https://jfsdactivityhubbackend-production.up.railway.app/student/getClubId/${storedUser.email}`);
                    
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
    if (loading) {
        return (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0', // Optional for a better background
              }}
            >
              <h1 style={{ fontSize: '2rem', color: '#333', fontWeight: 'bold' }}>Loading Clubs<span className="dots"></span></h1>
            </div>
            <style>
              {`
                .dots {
                  display: inline-block;
                  margin-left: 5px;
                }
                .dots::after {
                  content: '...';
                  display: inline-block;
                  animation: dots 1.5s steps(3, end) infinite;
                }
                @keyframes dots {
                  0% {
                    content: '';
                  }
                  33% {
                    content: '.';
                  }
                  66% {
                    content: '..';
                  }
                  100% {
                    content: '...';
                  }
                }
              `}
            </style>
          </>
        );
      }
      
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
