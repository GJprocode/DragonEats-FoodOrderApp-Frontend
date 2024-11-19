// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\ui\UsernameMenu.tsx

import { CircleUserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UsernameMenu = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        if (user?.email) {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${API_BASE_URL}/api/admin/check-admin/${user.email}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            console.error(`Admin check failed with status: ${response.status}`);
            setIsAdmin(false);
            return;
          }
  
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      }
    };
  
    checkAdminRole();
  }, [user, getAccessTokenSilently]);
  

  const handleLogout = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const returnToUrl = isProduction
      ? 'https://dragoneats-foodorderapp-frontend.onrender.com'  // Replace with your production URL
      : 'http://localhost:5173';
    
    logout();
    window.location.href = returnToUrl;  // Redirect after logout
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-green-500 gap-2">
        <CircleUserRound className="text-green-500" />
        {user?.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
      <DropdownMenuItem>
          <Link to="/order-status" className="font-bold hover:text-green-500">
            My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/manage-restaurant" className="font-bold hover:text-green-500">
            My Restaurant
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/user-profile" className="font-bold hover:text-green-500">
            User Profile
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem>
            <Link to="/admin-panel" className="font-bold hover:text-green-500">
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <Separator />
        <DropdownMenuItem>
          <Button
            onClick={handleLogout}
            className="flex flex-1 font-bold bg-green-500"
          >
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;
