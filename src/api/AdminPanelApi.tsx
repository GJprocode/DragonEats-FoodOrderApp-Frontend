// C:\Users\gertf\Desktop\FoodApp\frontend\src\api\AdminPanelApi.tsx


import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { Restaurant } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useUpdateRestaurantStatus = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantStatus = async (restaurantId: string, status: string, contractType?: string, contractId?: string) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/admin/update-status/${restaurantId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, contractType, contractId }),
      });

      if (!response.ok) throw new Error("Error updating restaurant status");
      return await response.json();
    } catch (error) {
      console.error("Error updating restaurant status:", error);
    }
  };

  return { updateRestaurantStatus };
};

export const useGetAdminRestaurants = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/admin/restaurants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error fetching restaurants");
        const data = await response.json();
        setRestaurants(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, [getAccessTokenSilently]);

  return { restaurants, isLoading };
};
