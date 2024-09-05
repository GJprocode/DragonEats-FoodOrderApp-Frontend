import React from "react";
import ManageRestaurantForm from "../forms/manage-restaurant-form/ManageRestaurantForm";
import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateMyRestaurant } from "../api/MyRestaurantApi";
import { useGetMyUser } from "@/api/MyUserApi"; // Import the hook to fetch current user data

const ManageRestaurantPage: React.FC = () => {
  const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
  const { restaurant, isLoading: isRestaurantLoading } = useGetMyRestaurant();
  const { updateRestaurant } = useUpdateMyRestaurant(); // Ensure this is correctly imported and used
  const { currentUser, isLoading: isUserLoading } = useGetMyUser(); // Fetch current user details

  if (isUserLoading || isRestaurantLoading) {
    return <div>Loading data...</div>; // Handle loading state while fetching user and restaurant data
  }

  if (!currentUser) {
    return <div>Error: User not found</div>; // Handle case where user data is not available
  }

  const isEditing = Boolean(restaurant && restaurant.restaurantName);  // Modify this condition to ensure we're checking for a non-empty restaurant

  const handleSave = (formData: FormData) => {
    if (isEditing) {
      updateRestaurant(formData);  // Call update when the restaurant exists
    } else {
      createRestaurant(formData);  // Call create when the restaurant does not exist
    }
  };

  return (
    <ManageRestaurantForm
      restaurant={restaurant || undefined} // Ensure restaurant is passed correctly
      onSave={handleSave}
      isLoading={isCreateLoading || isRestaurantLoading}
      currentUserEmail={currentUser.email} // Pass currentUserEmail to the form
    />
  );
};

export default ManageRestaurantPage;
