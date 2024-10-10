// frontend/src/api/OrderApi.tsx
import { Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to get orders:", errorText);
      throw new Error("Failed to get orders");
    }

    return response.json();
  };

  // Adjust the useQuery configuration to avoid unnecessary API calls
  const { data: orders, isLoading, refetch } = useQuery(
    "fetchMyOrders", // The query key, used for caching
    getMyOrdersRequest, // The function to fetch the data
    {
      refetchOnWindowFocus: false, // Prevent refetching when the window regains focus
      staleTime: 300000, // 5 minutes: Data is considered fresh for this time, prevents frequent refetching
      cacheTime: 600000, // 10 minutes: Data stays in cache for this time even if not used
      refetchOnMount: false, // Prevents refetching when the component remounts
      retry: 1, // Number of retry attempts on failure
    }
  );

  return { orders, isLoading, refetch };
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: number; // Ensure this is a number
    price: number;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    address: string;
    city: string;
    cellphone: string;
    // Include any additional fields
  };
  restaurantId: string; 
};

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createCheckoutSessionRequest = async (
    checkoutSessionRequest: CheckoutSessionRequest
  ) => {
    const accessToken = await getAccessTokenSilently();

    console.log("Creating checkout session with request:", checkoutSessionRequest);

    const response = await fetch(
      `${API_BASE_URL}/api/order/checkout/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutSessionRequest),
      }
    );

    console.log("Create checkout session response status:", response.status);
    console.log("CheckoutSessionRequest:", checkoutSessionRequest);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create checkout session:", errorText);
      throw new Error("Unable to create checkout session");
    }

    return response.json();
  };

  const {
    mutateAsync: createCheckoutSession,
    isLoading,
    error,
    reset,
  } = useMutation(createCheckoutSessionRequest);

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    createCheckoutSession,
    isLoading,
  };
};
