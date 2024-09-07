// src/pages/AdminPanelPage.tsx
import React from "react";
import { useFetchStatusCounts, useGetAdminRestaurants, useUpdateRestaurantStatus } from "../api/AdminPanelApi";
import AdminActionForm from "../forms/admin-action-form/AdminActionForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AdminPanelPage: React.FC = () => {
  const { restaurants, isLoading } = useGetAdminRestaurants();
  const { updateRestaurantStatus } = useUpdateRestaurantStatus();
  const { statusTotals } = useFetchStatusCounts();

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <h2>Total Restaurants and Statuses</h2>
          <ul>
            {statusTotals.map((status) => (
              <li key={status._id}>
                {status._id}: {status.count}
              </li>
            ))}
          </ul>

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
