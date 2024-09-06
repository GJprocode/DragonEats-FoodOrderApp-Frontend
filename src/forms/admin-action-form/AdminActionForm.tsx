import React from "react";
import { Restaurant } from "@/types";

interface AdminActionFormProps {
  restaurants: Restaurant[];
  onUpdate: (restaurantId: string, status: string, contractType: string, contractId: string) => void;
}

const AdminActionForm: React.FC<AdminActionFormProps> = ({ restaurants, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 mb-6">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Restaurant Name</th>
              <th className="py-2 px-4 border-b">City</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Contract Type</th>
              <th className="py-2 px-4 border-b">Contract ID</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td className="py-2 px-4 border-b">{restaurant.restaurantName}</td>
                <td className="py-2 px-4 border-b">{restaurant.city.join(", ")}</td>
                <td className="py-2 px-4 border-b">
                  <label>
                    Status:
                    <select
                      value={restaurant.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        onUpdate(
                          restaurant._id,
                          e.target.value,
                          restaurant.contractType || "",
                          restaurant.contractId || ""
                        )
                      }
                      className="border border-gray-300 p-1 rounded"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </label>
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={restaurant.contractType || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdate(
                        restaurant._id,
                        restaurant.status,
                        e.target.value,
                        restaurant.contractId || ""
                      )
                    }
                    className="border border-gray-300 p-1 rounded w-full"
                    placeholder="Contract Type"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={restaurant.contractId || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdate(
                        restaurant._id,
                        restaurant.status,
                        restaurant.contractType || "",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 p-1 rounded w-full"
                    placeholder="Contract ID"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() =>
                      onUpdate(
                        restaurant._id,
                        restaurant.status,
                        restaurant.contractType || "",
                        restaurant.contractId || ""
                      )
                    }
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActionForm;
