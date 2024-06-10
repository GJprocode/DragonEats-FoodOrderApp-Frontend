import React from "react";
import ManageRestaurantForm from "../forms/manage-restaurant-form/ManageRestaurantForm";
import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateMyRestaurant } from "../api/MyRestaurantApi";

// page component, do all our data fetching, API request etc. 
// make sense that we fetch the data and add the restaurant manage form here as well
// pass it to the component as a prop
// isLoading: isCreateLoading , change isLoading variable to isCreateLoading with colon :
const ManageRestaurantPage = () => {
   const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
const { restaurant } = useGetMyRestaurant();
const {  updateRestaurant , isLoading: isUpdateLoading} = useUpdateMyRestaurant();

 const isEditing = !!restaurant;

 // error property not added yet to manageRestaurantform, ctrl click to move to file
 // || double pipe means or like && and and === equals to and same type, !! mean not, old news
  return (
     <ManageRestaurantForm 
     restaurant={restaurant}
     onSave={isEditing ? updateRestaurant: createRestaurant}
     isLoading ={isCreateLoading || isUpdateLoading } 
     />
  );
};

export default ManageRestaurantPage;



