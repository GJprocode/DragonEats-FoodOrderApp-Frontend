// 

import React, { useEffect, useState } from "react";
import landingImage from "../assets/CellApp.png";
import appDownloadImage1 from "../assets/AppleStore.png";
import appDownloadImage2 from "../assets/GooglePlay.png";
import SearchBar, { SearchForm } from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [cityList, setCityList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/cities");
        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }
        const data = await response.json();
        setCityList(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="flex flex-col gap-12 items-center">
      <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-green-600">
          Superpower food & drinks that unleashes the dragon in you!
        </h1>
        <span className="text-xl">Magical DragonEats&Drinks delivered quick & easy.</span>
        <span className="text-xl">Restaurant delivery and Wholesale of drinks services.</span>
        <span className="text-xl">We are earth-friendly dragons.</span>
        <h2 className="text-xs">Available cities in Cambodia:</h2>
        <p className="test-xs"> { loading ? "Loading cities..." : cityList.length > 0 ? cityList.join(", ") : "No cities available"}</p>
        <SearchBar  
          placeHolder="Magical cities near you"
          onSubmit={handleSearchSubmit}
          searchQuery=""
          cityList={cityList} 
        />
      </div>
      <div className="md:grid md:grid-cols-2 gap-5 items-center">
        <img 
          src={landingImage} 
          alt="CellApp" 
          className="max-w-full" 
          style={{ width: '75%', maxWidth: '400px', height: 'auto' }} 
        />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="font-bold text-3xl tracking-tighter">Your order winged in!</span>
          <span>Download DragonEats App for magical food delivery!</span>
          <div className="flex gap-4">
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={appDownloadImage1}
                alt="Apple Store Logo"
                style={{ width: '150px', height: 'auto' }}
              />
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={appDownloadImage2}
                alt="Google Play Logo"
                style={{ width: '150px', height: 'auto' }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
