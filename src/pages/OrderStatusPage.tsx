import React, { useState } from "react";
import { useGetMyOrders, useCreateCheckoutSession } from "@/api/OrderApi";
import OrderStatusHeader from "../components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import OrderStatusDetail from "./OrderStatusDetail";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "../components/ui/dialog";

const OrderStatusPage = () => {
  const { orders, isLoading } = useGetMyOrders();
  const { createCheckoutSession } = useCreateCheckoutSession();
  const [filterDate, setFilterDate] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handlePayNow = async (orderId: string) => {
    try {
      const order = orders?.find((order) => order._id === orderId);
      if (!order) {
        console.error("Order not found.");
        return;
      }

      const checkoutSessionRequest = {
        cartItems: order.cartItems,
        deliveryDetails: order.deliveryDetails,
        restaurantId: order.restaurant._id,
      };

      // Create the checkout session through the backend and fetch the session URL.
      const response = await createCheckoutSession(checkoutSessionRequest);
      const { url } = response;

      // Store the URL in state but do not immediately navigate.
      setPaymentUrl(url);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const proceedWithStripe = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl; // Redirect to Stripe when ready.
    }
  };

  if (isLoading) {
    return "Loading...";
  }

  if (!orders || orders.length === 0) {
    return "No orders found";
  }

  const activeOrders = orders.filter((order) => order.status !== "delivered");

  const orderHistory = orders.filter(
    (order) =>
      order.status === "delivered" &&
      (!filterDate ||
        (order.dateDelivered &&
          new Date(order.dateDelivered).toISOString().split("T")[0] ===
            filterDate))
  );

  return (
    <Tabs defaultValue="active-orders">
      <TabsList>
        <TabsTrigger value="active-orders">My Order Status</TabsTrigger>
        <TabsTrigger value="order-history">My Order History</TabsTrigger>
      </TabsList>

      <TabsContent
        value="active-orders"
        className="space-y-10 bg-gray-50 p-10 rounded-lg"
      >
        <h2 className="text-2xl font-bold">
          {activeOrders.length} active orders
        </h2>
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

        {/* Payment Options Dialog */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-[425px] bg-gray-50">
            <h3 className="text-lg font-bold">Select Payment Method</h3>
            <p className="mt-2">Choose your preferred payment method:</p>
            <div className="flex flex-col space-y-4 mt-4">
              {/* Stacked buttons for payment options */}
              <Button className="bg-blue-500" onClick={proceedWithStripe}>
                Pay with Stripe
              </Button>
              <Button className="bg-gray-300" disabled>
                Pay with ABA (Coming Soon)
              </Button>
              <Button className="bg-gray-300" disabled>
                Pay with Wing (Coming Soon)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TabsContent>

      <TabsContent
        value="order-history"
        className="space-y-10 bg-gray-50 p-10 rounded-lg"
      >
        <h2 className="text-2xl font-bold">
          {orderHistory.length} delivered orders
        </h2>
        <div>
          <label htmlFor="filter-date" className="font-bold">
            Filter by date:
          </label>
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
