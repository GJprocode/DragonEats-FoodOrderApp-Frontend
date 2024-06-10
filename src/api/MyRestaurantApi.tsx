import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { Restaurant } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyRestaurant = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const getMyRestaurantRequest = async (): Promise<Restaurant | null> => {
        if (!isAuthenticated) return null;

        const accessToken = await getAccessTokenSilently();

        const response = await fetch (`${API_BASE_URL}/api/my/restaurant`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get restaurant");
        }

        return response.json();
    };    

    const { data: restaurant, isLoading } = useQuery(
        "fetchMyRestaurant", 
        getMyRestaurantRequest,
        { enabled: isAuthenticated } // Fetch data only if authenticated
    );

    return { restaurant, isLoading };
};

export const useCreateMyRestaurant = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const createMyRestaurantRequest = async (
        restaurantFormData: FormData
    ): Promise<Restaurant> => {
        if (!isAuthenticated) {
            throw new Error("User not authenticated");
        }

        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: restaurantFormData,
        });

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error("Restaurant already exists");
            } else {
                throw new Error("Failed to create restaurant");
            }
        }

        return response.json();
    };

    const {
        mutate: createRestaurant,
        isLoading,
        isSuccess,
        error
    } = useMutation(createMyRestaurantRequest);

    if (isSuccess) {
        toast.success("Restaurant created!");
    }

    if (error && (error as Error).message !== "Restaurant already exists") {
        toast.error("Unable to create restaurant");
    }

    return { createRestaurant, isLoading };
};

export const useUpdateMyRestaurant = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const updateRestaurantRequest = async (
        restaurantFormData: FormData
    ): Promise<Restaurant> => {
        if (!isAuthenticated) {
            throw new Error("User not authenticated");
        }

        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: restaurantFormData,
        });

        if (!response.ok) {
            throw new Error("Failed to update restaurant");
        }

        return response.json();
    };

    const {
        mutate: updateRestaurant,
        isLoading,
        isSuccess,
        error
    } = useMutation(updateRestaurantRequest);

    if (isSuccess) {
        toast.success("Restaurant updated");
    }

    if (error) {
        toast.error("Unable to update restaurant");
    }

    return { updateRestaurant, isLoading };
};
