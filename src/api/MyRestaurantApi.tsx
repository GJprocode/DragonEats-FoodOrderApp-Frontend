// C:\Users\gertf\Desktop\FoodApp\frontend\src\api\MyRestaurantApi.tsx

import { Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility function to replace HTTP URLs with HTTPS
const enforceHttpsUrls = (restaurant: Restaurant): Restaurant => {
  if (restaurant.restaurantImageUrl) {
    restaurant.restaurantImageUrl = restaurant.restaurantImageUrl.replace("http://", "https://");
  }
  restaurant.menuItems.forEach((menuItem) => {
    if (menuItem.imageUrl) {
      menuItem.imageUrl = menuItem.imageUrl.replace("http://", "https://");
    }
  });
  return restaurant;
};

export const useGetMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantRequest = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // added to get access fix 400 error in headers
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    const data = await response.json();
    console.log("Fetched restaurant data:", data);

    // Enforce HTTPS for all image URLs
    return enforceHttpsUrls(data);
  };

  const { data: restaurant, isLoading, refetch } = useQuery(
    "fetchMyRestaurant",
    getMyRestaurantRequest
  );

  return { restaurant, isLoading, refetch };
};

export const useCreateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to create restaurant");
    }

    const data = await response.json();
    return enforceHttpsUrls(data);
  };

  const {
    mutate: createRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(createMyRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant created!");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { createRestaurant, isLoading };
};

export const useUpdateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      console.error("Failed to update restaurant:", response.statusText);
      throw new Error("Failed to update restaurant");
    }

    const data = await response.json();
    return enforceHttpsUrls(data);
  };

  const {
    mutate: updateRestaurant,
    isLoading,
    error,
    isSuccess,
  } = useMutation(updateRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant Updated");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { updateRestaurant, isLoading };
};
