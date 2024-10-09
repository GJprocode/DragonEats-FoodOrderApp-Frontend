import React, { useState } from "react";
import { useGetMyOrders, useCreateCheckoutSession } from "@/api/OrderApi";
import OrderStatusHeader from "../components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import OrderStatusDetail from "./OrderStatusDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";

const OrderStatusPage = () => {
  const { orders, isLoading } = useGetMyOrders();
  const { createCheckoutSession } = useCreateCheckoutSession();
  const [filterDate, setFilterDate] = useState("");

  if (isLoading) {
    return "Loading...";
  }

  if (!orders || orders.length === 0) {
    return "No orders found";
  }

  // Filter for active orders (not yet delivered)
  const activeOrders = orders.filter((order) => order.status !== "delivered");

  // Filter for delivered orders with date filtering
  const orderHistory = orders.filter(
    (order) =>
      order.status === "delivered" &&
      (!filterDate || (order.dateDelivered && new Date(order.dateDelivered).toISOString().split("T")[0] === filterDate))
  );

  const handlePayNow = async (orderId: string) => {
    try {
      const order = orders.find((order) => order._id === orderId);
      if (!order) {
        console.error("Order not found.");
        return;
      }

      // Prepare the request object as expected by the backend
      const checkoutSessionRequest = {
        cartItems: order.cartItems,
        deliveryDetails: order.deliveryDetails,
        restaurantId: order.restaurant._id,
      };

      const response = await createCheckoutSession(checkoutSessionRequest);
      const { sessionId } = response;
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
      if (stripe && sessionId) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  return (
    <Tabs defaultValue="active-orders">
      <TabsList>
        <TabsTrigger value="active-orders">My Order Status</TabsTrigger>
        <TabsTrigger value="order-history">My Order History</TabsTrigger>
      </TabsList>

      <TabsContent value="active-orders" className="space-y-10 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-2xl font-bold">{activeOrders.length} active orders</h2>
        {activeOrders.map((order) => (
          <div key={order._id} className="space-y-10">
            <OrderStatusHeader order={order} />
            <div className="grid gap-10 md:grid-cols-2">
              <OrderStatusDetail order={order} />
              <AspectRatio ratio={16 / 5}>
                <img
                  alt="image"
                  src={order.restaurant.restaurantImageUrl}
                  className="rounded-md object-cover h-full w-full"
                />
              </AspectRatio>
            </div>
            {/* Show the "Pay Now" button only if the order status is "confirmed" */}
            {order.status === "confirmed" && (
              <div className="flex justify-end">
                <Button
                  className="bg-green-500"
                  onClick={() => handlePayNow(order._id)}
                >
                  Pay Now
                </Button>
              </div>
            )}
          </div>
        ))}
      </TabsContent>

      <TabsContent value="order-history" className="space-y-10 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-2xl font-bold">{orderHistory.length} delivered orders</h2>
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
        {orderHistory.map((order) => (
          <div key={order._id} className="space-y-10">
            <OrderStatusHeader order={order} />
            <div className="grid gap-10 md:grid-cols-2">
              <OrderStatusDetail order={order} />
              <AspectRatio ratio={16 / 5}>
                <img
                  alt="image"
                  src={order.restaurant.restaurantImageUrl}
                  className="rounded-md object-cover h-full w-full"
                />
              </AspectRatio>
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default OrderStatusPage;
