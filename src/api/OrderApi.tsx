// frontend/src/api/OrderApi.tsx
import { Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetUserOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getUserOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch user orders:", errorText);
      throw new Error("Failed to fetch user orders");
    }

    return response.json();
  };

  const { data: orders, isLoading, refetch } = useQuery(
    "fetchUserOrders",
    getUserOrdersRequest,
    {
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      cacheTime: 600000, // 10 minutes
      refetchOnMount: false,
      retry: 1, // Retry on failure once
    }
  );

  return { orders, isLoading, refetch };
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    address: string;
    city: string;
    cellphone: string;
  };
  restaurantId: string;
};

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createCheckoutSessionRequest = async (
    checkoutSessionRequest: CheckoutSessionRequest
  ) => {
    const accessToken = await getAccessTokenSilently();

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

  return { createCheckoutSession, isLoading };
};

export const useUpdateUserOrderStatus = () => {
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

    const response = await fetch(`${API_BASE_URL}/api/order/${orderId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, message }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user order status");
    }

    return response.json();
  };

  // Pass the wrapped function to useMutation
  const { mutateAsync: updateUserOrder, isLoading, error, isSuccess, reset } =
    useMutation(mutationFn);

  if (isSuccess) {
    toast.success("Order status updated");
  }

  if (error) {
    toast.error("Failed to update order");
    reset();
  }

  return { updateUserOrder, isLoading };
};


