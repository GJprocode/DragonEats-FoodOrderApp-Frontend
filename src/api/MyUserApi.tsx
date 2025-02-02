// C:\Users\gertf\Desktop\FoodApp\frontend\src\api\MyUserApi.tsx

import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Hook to get the current user's details, fixed for linked users
export const useGetMyUser = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const getMyUserRequest = async (): Promise<User> => {
    try {
      const accessToken = await getAccessTokenSilently();
      console.log("Access token retrieved:", accessToken);
  
      const response = await fetch(`${API_BASE_URL}/api/my/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
  
      return response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  const { data: currentUser, isLoading, error } = useQuery(
    'fetchCurrentUser',
    getMyUserRequest,
    {
      enabled: isAuthenticated, // Fetch only when the user is authenticated
    }
  );

  if (error) {
    toast.error(`Failed to fetch user: ${error}`);
  }

  return { currentUser, isLoading };
};




// Hook to create a new user
export const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyUserRequest = async (user: { auth0Id: string; email: string }) => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`${API_BASE_URL}/api/my/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`Failed to create new user: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const { mutateAsync: createUser, isLoading, isError, isSuccess } = useMutation(createMyUserRequest);

  return {
    createUser,
    isLoading,
    isError,
    isSuccess,
  };
};

// Hook to update the current user's details
export const useUpdateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyUserRequest = async (formData: {
    name: string;
    address: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  }) => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`${API_BASE_URL}/api/my/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return useMutation(updateMyUserRequest, {
    mutationKey: "updateUser",
  });
};

