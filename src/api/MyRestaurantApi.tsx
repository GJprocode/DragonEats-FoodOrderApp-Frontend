// C:\Users\gertf\Desktop\FoodApp\frontend\src\api\MyRestaurantApi.tsx

import { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return enforceHttpsUrls(await response.json());
  };

  const { data: restaurant, isLoading, refetch } = useQuery(
    "fetchMyRestaurant",
    getMyRestaurantRequest
  );

  return { restaurant, isLoading, refetch };
};

export const useCreateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyRestaurantRequest = async (formData: FormData): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create restaurant");
    }

    return enforceHttpsUrls(await response.json());
  };

  const { mutate: createRestaurant, isLoading, error, isSuccess } = useMutation(
    createMyRestaurantRequest
  );

  if (isSuccess) {
    toast.success("Restaurant created");
  }

  if (error) {
    toast.error("Failed to create restaurant");
  }

  return { createRestaurant, isLoading };
};

export const useUpdateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantRequest = async (formData: FormData): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update restaurant");
    }

    return enforceHttpsUrls(await response.json());
  };

  const { mutate: updateRestaurant, isLoading, error, isSuccess } = useMutation(
    updateRestaurantRequest
  );

  if (isSuccess) {
    toast.success("Restaurant updated");
  }

  if (error) {
    toast.error("Failed to update restaurant");
  }

  return { updateRestaurant, isLoading };
};

export const useGetRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant orders");
    }

    return response.json();
  };

  const { data: orders, isLoading } = useQuery(
    "fetchRestaurantOrders",
    getRestaurantOrdersRequest
  );

  return { orders, isLoading };
};

export const useUpdateRestaurantOrderStatus = () => {
  const { getAccessTokenSilently } = useAuth0();

  // Wrap the mutation function
  const mutationFn = async ({
    orderId,
    status,
    message,
  }: {
    orderId: string;
    status: string;
    message?: string;
  }) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/my/restaurant/order/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, message }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update restaurant order status");
    }

    return response.json();
  };

  // Pass the wrapped function to useMutation
  return useMutation(mutationFn);
};



