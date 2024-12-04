// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\ui\ConsentBanner.tsx


import { useState, useEffect } from "react";
import { getCookie, setCookie } from "./cookiesUtils";

const ConsentBanner = () => {
  const [step, setStep] = useState<"cookies" | "location" | null>(null);

  useEffect(() => {
    const cookiesConsent = getCookie("user_consent");
    if (!cookiesConsent) {
      setStep("cookies");
    } else {
      setStep("location");
    }
  }, []);

  const handleCookiesConsent = () => {
    setCookie("user_consent", "true", 365);
    setStep("location");
  };

  const handleLocationConsent = () => {
    requestGeolocation();
    setStep(null);
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sessionStorage.setItem("userLocation", JSON.stringify({ latitude, longitude }));
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        alert("Unable to access location.");
      }
    );
  };

  return (
    <>
      {step === "cookies" && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-sm md:text-base lg:text-lg">
              We use cookies to improve your experience. Do you consent to our use of cookies?
            </span>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleCookiesConsent}
            >
              Accept Cookies
            </button>
          </div>
        </div>
      )}

      {step === "location" && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-sm md:text-base lg:text-lg">
              We need your location to provide better services. Do you consent to share your
              location?
            </span>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleLocationConsent}
            >
              Accept Location
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsentBanner;
