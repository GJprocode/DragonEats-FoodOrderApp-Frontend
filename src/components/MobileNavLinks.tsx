// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\MobileNavLinks.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is defined in your .env file

const MobileNavLinks = () => {
  const { logout, user } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        if (user?.email) {
          // Fetch admin status from the backend
          const response = await axios.get(`${API_BASE_URL}/check-admin/${user.email}`);
          setIsAdmin(response.data.isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
      }
    };

    checkAdminRole();
  }, [user]);

  return (
    <>
      <Link
        to="/manage-restaurant"
        className="flex bg-white items-center font-bold hover:text-green-500"
      >
        Manage Restaurant
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
        onClick={() => logout()}
        className="flex items-center px-3 font-bold hover:bg-gray-500"
      >
        Log Out
      </Button>
    </>
  );
};

export default MobileNavLinks;
