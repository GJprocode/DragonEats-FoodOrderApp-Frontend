// frontend/src/api/OrderUserApi.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { User } from "../types";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFetchUserProfile = (userId: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchUserProfile = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();
    const response = await axios.get(`${API_BASE_URL}/api/my/user`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  const { data: userProfile, isLoading, error, refetch } = useQuery(
    ["fetchUserProfile", userId], // Include userId in the query key to avoid conflicts
    fetchUserProfile,
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
      staleTime: 300000,
      cacheTime: 600000,
      retry: 1,
    }
  );

  if (error) {
    toast.error("Failed to fetch user profile data.");
  }

  return { userProfile, isLoading, refetch };
};



  export const useUpdateOrderDetails = () => {
    const { getAccessTokenSilently } = useAuth0();
  
    const updateOrderDetails = async (orderId: string, data: Partial<User>) => {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.put(
        `${API_BASE_URL}/api/order-user/order-details/${orderId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    };
  
    const { mutateAsync: updateOrder, isLoading, error } = useMutation(
      ({ orderId, data }: { orderId: string; data: Partial<User> }) =>
        updateOrderDetails(orderId, data)
    );
  
    if (error) {
      toast.error("Failed to update order details.");
    }
  
    return { updateOrder, isLoading };
  };
  

export const useUpdateUserProfile = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateUserProfile = async (userId: string, data: Partial<User>) => {
    const accessToken = await getAccessTokenSilently();
    const response = await axios.put(
      `${API_BASE_URL}/api/my/user/${userId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const { mutateAsync: updateUser, isLoading, error } = useMutation(
    ({ userId, data }: { userId: string; data: Partial<User> }) =>
      updateUserProfile(userId, data)
  );

  if (error) {
    toast.error("Failed to update user profile.");
  }

  return { updateUser, isLoading };
};
