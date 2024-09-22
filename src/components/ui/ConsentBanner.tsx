// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\ui\ConsentBanner.tsx


import { useState, useEffect } from "react";
import { getCookie, setCookie } from "./cookiesUtils"; // Correct the import path

const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Check if consent has already been given
  useEffect(() => {
    const consent = getCookie("user_consent");
    if (!consent) {
      setIsVisible(true); // Show banner if no consent
    }
  }, []);

  // Handle user consent
  const handleConsent = () => {
    setCookie("user_consent", "true", 365); // Store consent for 1 year
    setIsVisible(false);
  };

  return isVisible ? (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <span>
          We use cookies to improve your experience. By continuing, you agree
          to our use of cookies.
        </span>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleConsent}
        >
          I Agree
        </button>
      </div>
    </div>
  ) : null;
};

export default ConsentBanner;
