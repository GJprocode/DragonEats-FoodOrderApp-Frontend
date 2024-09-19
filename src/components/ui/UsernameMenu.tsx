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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is defined in your .env file

const UsernameMenu = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        if (user?.email) {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${API_BASE_URL}/check-admin/${user.email}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Error checking admin role');
          }

          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
      }
    };

    checkAdminRole();
  }, [user, getAccessTokenSilently]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-green-500 gap-2">
        <CircleUserRound className="text-green-500" />
        {user?.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/manage-restaurant" className="font-bold hover:text-green-500">
            Manage Restaurant
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
            onClick={() => logout()}
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
