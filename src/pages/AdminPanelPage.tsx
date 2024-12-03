// C:\Users\gertf\Desktop\FoodApp\frontend\src\pages\AdminPanelPage.tsx

// src/pages/AdminPanelPage.tsx
import React, { useEffect, useState } from "react";
import { useGetAdminRestaurants, useUpdateRestaurantStatus } from "../api/AdminPanelApi";
import AdminActionForm from "../forms/admin-action-form/AdminActionForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AdminPanelPage: React.FC = () => {
  const { restaurants, isLoading } = useGetAdminRestaurants();
  const { updateRestaurantStatus } = useUpdateRestaurantStatus();
  const [statusTotals, setStatusTotals] = useState<{ submitted: number, pending: number, approved: number, rejected: number }>({
    submitted: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Calculate totals
  useEffect(() => {
    if (!isLoading && restaurants) {
      const totals = restaurants.reduce((acc, restaurant) => {
        acc[restaurant.status] = acc[restaurant.status] + 1 || 1;
        return acc;
      }, { submitted: 0, pending: 0, approved: 0, rejected: 0 });

      setStatusTotals(totals);
    }
  }, [isLoading, restaurants]);

  return (
    <div>
      <h1 className="text-lg font-bold">Admin Panel</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {/* Display the status totals in a row with form styling */}
          <div className="flex justify-between bg-gray-100 p-4 rounded shadow mb-4">
            <div className="text-sm">
              <strong>Total Restaurants:</strong> {restaurants.length}
            </div>
            <div className="text-sm">
              <strong>Submitted:</strong> {statusTotals.submitted}
            </div>
            <div className="text-sm">
              <strong>Pending:</strong> {statusTotals.pending}
            </div>
            <div className="text-sm">
              <strong>Approved:</strong> {statusTotals.approved}
            </div>
            <div className="text-sm">
              <strong>Rejected:</strong> {statusTotals.rejected}
            </div>
          </div>

          {/* Render the admin action form */}
          <AdminActionForm
            restaurants={restaurants}
            onUpdate={updateRestaurantStatus}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
