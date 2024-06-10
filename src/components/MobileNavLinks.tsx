import { Link } from "react-router-dom"
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const MobileNavLinks = () => {
    const { logout } = useAuth0();
  return (
    <>
       <Link 
    to="manage-restaurant"
     className="flex bg-white items-center font-bold hover:text-green-500"
     >
        Manage Restaurant
    </Link>
    <Link 
    to="user-profile"
     className="flex bg-white items-center font-bold hover:text-green-500"
     >
        User Profile
    </Link>
 

    <Button onClick={() => logout()} className="flex-items-center px-3 font-bold hover:bg-gray-500"
    >
        Log Out
    </Button>
    </>
  );
};

export default MobileNavLinks;