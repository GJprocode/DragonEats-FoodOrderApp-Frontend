import React, { useState } from "react";
import ManageRestaurantForm from "../forms/manage-restaurant-form/ManageRestaurantForm";
import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetRestaurantOrders,
  useUpdateMyRestaurant,
} from "../api/MyRestaurantApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import OrderItemCard from "../components/OrderItemCard";
import { Order } from "@/types";

const ManageRestaurantPage: React.FC = () => {
  const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();
  const { orders } = useGetRestaurantOrders();

  const [filterDate, setFilterDate] = useState("");

  const isEditing = Boolean(restaurant);

  const handleSave = (formData: FormData) => {
    if (isEditing) {
      updateRestaurant(formData);
    } else {
      createRestaurant(formData);
    }
  };

// Filter for active orders (exclude delivered and resolved)
const activeOrders = orders?.filter(
  (order: Order) => !["delivered", "resolved"].includes(order.status)
);

// Filter for history orders (delivered or resolved) with date filtering
const orderHistory = orders?.filter((order: Order) => {
  const isHistoryOrder = ["delivered", "resolved"].includes(order.status);

  // Match the date based on the backend format
  const orderDate = new Date(order.dateDelivered || order.createdAt)
    .toISOString()
    .split("T")[0]; // Extract YYYY-MM-DD format

  return isHistoryOrder && (!filterDate || orderDate === filterDate);
});


  return (
    <Tabs defaultValue="orders">
      <TabsList className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <TabsTrigger value="orders">My Restaurant Orders</TabsTrigger>
        <TabsTrigger value="orders-history">My Restaurant Order History</TabsTrigger>
        <TabsTrigger value="manage-restaurant">My Restaurant</TabsTrigger>
      </TabsList>

      <TabsContent value="orders" className="space-y-5 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-2xl font-bold">{activeOrders?.length} active orders</h2>
        {activeOrders?.map((order: Order) => (
          <OrderItemCard key={order._id} order={order} />
        ))}
      </TabsContent>

      <TabsContent value="orders-history" className="space-y-5 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-2xl font-bold">{orderHistory?.length} orders in history</h2>
        <div>
          <label htmlFor="filter-date" className="font-bold">Filter by date:</label>
          <input
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded"
          />
        </div>
        {orderHistory?.map((order: Order) => (
          <OrderItemCard key={order._id} order={order} />
        ))}
      </TabsContent>

      <TabsContent value="manage-restaurant">
        <ManageRestaurantForm
          restaurant={restaurant}
          onSave={handleSave}
          isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
