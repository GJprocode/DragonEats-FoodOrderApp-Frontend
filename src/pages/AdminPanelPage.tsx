import React from "react";
import { useGetAdminRestaurants, useUpdateRestaurantStatus } from "../api/AdminPanelApi";
import AdminActionForm from "../forms/admin-action-form/AdminActionForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Restaurant } from "@/types"; // Ensure you're importing the Restaurant type

const AdminPanelPage: React.FC = () => {
  const { restaurants, isLoading } = useGetAdminRestaurants();
  const { updateRestaurantStatus } = useUpdateRestaurantStatus();

  const handleUpdate = async (restaurantId: string, status: string, contractType: string, contractId: string) => {
    try {
      await updateRestaurantStatus(restaurantId, status, contractType, contractId);
      console.log("Restaurant status updated successfully");
    } catch (error) {
      console.error("Failed to update restaurant", error);
    }
  };

  // Explicitly define the type for restaurants
  const totalRestaurants = (restaurants as Restaurant[])?.length || 0;
  const totalSubmitted = (restaurants as Restaurant[])?.filter((r) => r.status === "submitted").length || 0;
  const totalPending = (restaurants as Restaurant[])?.filter((r) => r.status === "pending").length || 0;
  const totalApproved = (restaurants as Restaurant[])?.filter((r) => r.status === "approved").length || 0;
  const totalRejected = (restaurants as Restaurant[])?.filter((r) => r.status === "rejected").length || 0;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      {/* Display totals */}
      <div className="mb-4 space-y-2">
        <p>Total Restaurants: {totalRestaurants}</p>
        <p>Submitted: {totalSubmitted}</p>
        <p>Pending: {totalPending}</p>
        <p>Approved: {totalApproved}</p>
        <p>Rejected: {totalRejected}</p>
      </div>
      <AdminActionForm
        restaurants={restaurants as Restaurant[]}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default AdminPanelPage;
