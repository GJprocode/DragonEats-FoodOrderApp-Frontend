import React from "react";
import ManageRestaurantForm from "../forms/manage-restaurant-form/ManageRestaurantForm";
import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateMyRestaurant } from "../api/MyRestaurantApi";

const ManageRestaurantPage: React.FC = () => {
  const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();

  const isEditing = Boolean(restaurant);

  const handleSave = (formData: FormData) => {
    if (isEditing) {
      updateRestaurant(formData);
    } else {
      createRestaurant(formData);
    }
  };

  return (
    <ManageRestaurantForm
      restaurant={restaurant}
      onSave={handleSave}
      isLoading={isCreateLoading || isUpdateLoading}
    />
  );
};

export default ManageRestaurantPage;
