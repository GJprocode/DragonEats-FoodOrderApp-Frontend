// import React, { useState, useEffect } from 'react';

import React, { useState, useEffect } from 'react';

interface Restaurant {
  _id: string;
  restaurantName: string;
  city: string | string[];
  status: string;
  contractType?: string;
  contractId?: string;
  lastUpdated?: string;
}

const AdminPanel: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [updatedRestaurants, setUpdatedRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    // Fetch restaurants data from the server
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/admin/restaurants');
        const data: Restaurant[] = await response.json();
        setRestaurants(data);
        setUpdatedRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // Calculate totals for the summary box
  const totalRestaurants = restaurants.length;
  const totalSubmitted = restaurants.filter(r => r.status === 'submitted').length;
  const totalPending = restaurants.filter(r => r.status === 'pending').length;
  const totalApproved = restaurants.filter(r => r.status === 'approved').length;
  const totalRejected = restaurants.filter(r => r.status === 'rejected').length;

  const handleInputChange = (index: number, field: keyof Restaurant, value: string) => {
    const updated = [...updatedRestaurants];
    updated[index][field] = value;
    setUpdatedRestaurants(updated);
  };

  const handleStatusChange = (index: number, value: string) => {
    handleInputChange(index, 'status', value);
  };

  const handleContractTypeChange = (index: number, value: string) => {
    handleInputChange(index, 'contractType', value);
  };

  const handleSubmit = async (index: number): Promise<void> => {
    const restaurant = updatedRestaurants[index];
    try {
      const response = await fetch(`http://localhost:7000/api/admin/update-status/${restaurant._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: restaurant.status,
          contractType: restaurant.contractType,
          contractId: restaurant.contractId,
        }),
      });

      if (response.ok) {
        const data: Restaurant = await response.json();
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((item, idx) => (idx === index ? data : item))
        );
      } else {
        console.error('Failed to update restaurant status');
      }
    } catch (error) {
      console.error('Error updating restaurant status:', error);
    }
  };

  return (
    <div>
      <h1 className="text-sm">Admin Panel</h1>

      {/* Summary Box */}
      <div className="flex justify-between bg-gray-100 p-4 rounded shadow mb-4">
        <div className="text-sm">
          <strong>Total Restaurants:</strong> {totalRestaurants}
        </div>
        <div className="text-sm">
          <strong>Total Submitted:</strong> {totalSubmitted}
        </div>
        <div className="text-sm">
          <strong>Total Pending:</strong> {totalPending}
        </div>
        <div className="text-sm">
          <strong>Total Approved:</strong> {totalApproved}
        </div>
        <div className="text-sm">
          <strong>Total Rejected:</strong> {totalRejected}
        </div>
      </div>

      {/* Restaurant Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-sm">Restaurant Name</th>
            <th className="border p-2 text-sm">City</th>
            <th className="border p-2 text-sm">Current Status</th>
            <th className="border p-2 text-sm">Contract Type</th>
            <th className="border p-2 text-sm">Contract ID</th>
            <th className="border p-2 text-sm">Last Updated</th>
            <th className="border p-2 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {updatedRestaurants.map((restaurant, index) => (
            <tr key={restaurant._id}>
              <td className="border p-2 text-sm">{restaurant.restaurantName}</td>
              <td className="border p-2 text-sm break-words">
                {Array.isArray(restaurant.city) ? restaurant.city.join(", ") : restaurant.city}
              </td>
              <td className="border p-2 text-sm">
                <select
                  value={restaurant.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                  title="Select status"
                  className="border p-1 w-full"
                >
                  <option value="submitted">Submitted</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td className="border p-2 text-sm">
                <input
                  type="text"
                  placeholder="Contract Type"
                  value={restaurant.contractType || ''}
                  onChange={(e) => handleContractTypeChange(index, e.target.value)}
                  className="border p-1 w-full"
                />
              </td>
              <td className="border p-2 text-sm">
                <input
                  type="text"
                  className="w-full p-1 text-sm border rounded"
                  placeholder="Contract ID"
                  value={restaurant.contractId || ''}
                  onChange={(e) => handleInputChange(index, 'contractId', e.target.value)}
                />
              </td>
              <td className="border p-2 text-sm">{restaurant.lastUpdated || 'N/A'}</td>
              <td className="border p-2 text-sm">
                <button
                  className="mt-2 w-full p-1 text-sm bg-blue-500 text-white rounded"
                  onClick={() => handleSubmit(index)}
                >
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;

