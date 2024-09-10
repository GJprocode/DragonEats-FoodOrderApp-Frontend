// // C:\Users\gertf\Desktop\FoodApp\frontend\src\api\RestaurantApi.tsx
// import { SearchState } from "@/pages/SearchPage";
// import { Restaurant, RestaurantSearchResponse } from "@/types";
// import { useQuery } from "react-query";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export const useGetRestaurant = (restaurantId?: string) => {
//   const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
//     const response = await fetch(
//       `${API_BASE_URL}/api/restaurant/${restaurantId}`
//     );

//     if (!response.ok) {
//       throw new Error("Failed to get restaurant");
//     }

//     return response.json();
//   };

//   const { data: restaurant, isLoading } = useQuery(
//     "fetchRestaurant",
//     getRestaurantByIdRequest,
//     {
//       enabled: !!restaurantId,
//     }
//   );

//   return { restaurant, isLoading };
// };

// export const useSearchRestaurants = (
//   searchState: SearchState,
//   city?: string
// ) => {
//   const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
//     const params = new URLSearchParams();
//     params.set("searchQuery", searchState.searchQuery);
//     params.set("page", searchState.page.toString());
//     params.set("selectedCuisines", searchState.selectedCuisines.join(","));
//     params.set("sortOption", searchState.sortOption);
//     params.set("selectedBusinessType", searchState.selectedBusinessType.join(",")); // Add business type to params

//     const response = await fetch(
//       `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
//     );

//     if (!response.ok) {
//       throw new Error("Failed to get restaurants");
//     }

//     return response.json();
//   };

//   const { data: results, isLoading } = useQuery(
//     ["searchRestaurants", searchState],
//     createSearchRequest,
//     { enabled: !!city }
//   );

//   return {
//     results,
//     isLoading,
//   };
// };


import { SearchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant = (restaurantId?: string) => {
  const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/${restaurantId}`
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: restaurant, isLoading } = useQuery(
    "fetchRestaurant",
    getRestaurantByIdRequest,
    {
      enabled: !!restaurantId,
    }
  );

  return { restaurant, isLoading };
};

// API hook to search restaurants in a city
export const useSearchRestaurants = (
  searchState: SearchState,
  city?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);
    params.set("selectedBusinessType", searchState.selectedBusinessType.join(",")); // Add business type to params

    // Call the backend to search restaurants in the city, ensuring only approved restaurants are returned
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurants");
    }

    return response.json();
  };

  const { data: results, isLoading } = useQuery(
    ["searchRestaurants", searchState],
    createSearchRequest,
    { enabled: !!city }
  );

  return {
    results,
    isLoading,
  };
};