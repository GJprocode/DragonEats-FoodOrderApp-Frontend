// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\MobileNavLinks.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is defined in your .env file

const MobileNavLinks = () => {
  const { logout, user, getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        if (user?.email) {
          const token = await getAccessTokenSilently();
          const response = await axios.get(
            `${API_BASE_URL}/api/admin/check-admin/${user.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsAdmin(response.data.isAdmin);
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error response:", error.response);
        }
      }
    };

    checkAdminRole();
  }, [user, getAccessTokenSilently]);

  const handleLogout = () => {
    const isProduction = process.env.NODE_ENV === "production";
    const returnToUrl = isProduction
      ? "https://dragoneats-foodorderapp-frontend.onrender.com" // Replace with your production URL
      : "http://localhost:5173";

    logout();
    window.location.href = returnToUrl; // Redirect after logout
  };

  return (
    <>
      <Link
        to="/order-status"
        className="flex bg-white items-center font-bold hover:text-green-500"
      >
        My Orders
      </Link>
 
      <Link
        to="/manage-restaurant"
        className="flex bg-white items-center font-bold hover:text-green-500"
      >
        My Restaurant
      </Link>
      <Link
        to="/user-profile"
        className="flex bg-white items-center font-bold hover:text-green-500"
      >
        User Profile
      </Link>
      {isAdmin && (
        <Link
          to="/admin-panel"
          className="flex bg-white items-center font-bold hover:text-green-500"
        >
          Admin
        </Link>
      )}
      <Button
        onClick={handleLogout}
        className="flex items-center px-3 font-bold hover:bg-gray-500"
      >
        Log Out
      </Button>
    </>
  );
};

export default MobileNavLinks;
