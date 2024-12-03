import React, { useState, useEffect } from "react";
import { useGetUserOrders, useCreateCheckoutSession } from "@/api/OrderApi";
import OrderStatusHeader from "../components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import OrderStatusDetail from "./OrderStatusDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const OrderStatusPage = () => {
  const { orders, isLoading } = useGetUserOrders();
  const { createCheckoutSession } = useCreateCheckoutSession();
  const [filterDate, setFilterDate] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const handlePayNow = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const proceedWithStripe = async () => {
    if (!selectedOrder) return;

    try {
      const order = orders?.find((order) => order._id === selectedOrder);
      if (!order || order.status !== "confirmed") {
        console.error("Order must be in 'confirmed' state to proceed with payment.");
        return;
      }

      const checkoutSessionRequest = {
        cartItems: order.cartItems,
        deliveryDetails: order.deliveryDetails,
        restaurantId: order.restaurant._id,
        orderId: order._id,
      };

      const response = await createCheckoutSession(checkoutSessionRequest);
      const { sessionId } = response;

      if (sessionId) {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
        await stripe?.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  // Define active orders
  const activeOrders = orders?.filter(
    (order) => !["delivered", "resolved"].includes(order.status)
  ) || [];

  // Define filtered order history
  const filteredOrderHistory = orders?.filter((order) => {
    const isHistoryOrder = ["delivered", "resolved"].includes(order.status);

    // Match the date based on the backend format
    const orderDate = new Date(order.dateDelivered || order.createdAt)
      .toISOString()
      .split("T")[0]; // Extract YYYY-MM-DD format

    return isHistoryOrder && (!filterDate || orderDate === filterDate);
  }) || []; // Default to empty array

  useEffect(() => {
    orders?.forEach((order) => {
      if (order.status === "paid") {
        const toastKey = `toast-${order._id}-paid`;
        if (!sessionStorage.getItem(toastKey)) {
          toast.success("Your order has been successfully paid.");
          sessionStorage.setItem(toastKey, "true");
        }
      }
    });
  }, [orders]);

  return (
    <Tabs defaultValue="active-orders">
      <TabsList>
        <TabsTrigger value="active-orders">My Order Status</TabsTrigger>
        <TabsTrigger value="order-history">My Order History</TabsTrigger>
      </TabsList>

      <TabsContent value="active-orders" className="space-y-10 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-2xl font-bold">{activeOrders.length} active orders</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : activeOrders.length > 0 ? (
          activeOrders.map((order) => (
            <div
              key={order._id}
              className="space-y-10 bg-white rounded-lg shadow-md border border-yellow-400 p-4"
            >
              <OrderStatusHeader order={order} />
              <div className="grid gap-10 md:grid-cols-2">
                <OrderStatusDetail order={order} />
                <AspectRatio ratio={16 / 9} className="relative bg-white rounded-md overflow-hidden">
                  <img
                    alt="Restaurant Image"
                    src={order.restaurant.restaurantImageUrl}
                    className="absolute inset-0 w-full h-full object-contain p-2"
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
          ))
        ) : (
          <div>No active orders</div>
        )}

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-[425px] bg-gray-50">
            <h3 className="text-lg font-bold" id="dialog-title">
              Select Payment Method
            </h3>
            <p className="mt-2" id="dialog-description">
              Choose your preferred payment method:
            </p>
            <div className="flex flex-col space-y-4 mt-4">
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

      <TabsContent value="order-history" className="space-y-10 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-2xl font-bold">{filteredOrderHistory.length} orders in history</h2>
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
        {filteredOrderHistory.length > 0 ? (
          filteredOrderHistory.map((order) => (
            <div
              key={order._id}
              className="space-y-10 bg-white rounded-lg shadow-md border border-yellow-400 p-4"
            >
              <OrderStatusHeader order={order} />
              <div className="grid gap-10 md:grid-cols-2">
                <OrderStatusDetail order={order} />
                <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
                  <img
                    alt="Restaurant Image"
                    src={order.restaurant.restaurantImageUrl}
                    className="absolute inset-0 w-full h-full object-contain p-2"
                  />
                </AspectRatio>
              </div>
            </div>
          ))
        ) : (
          <div>No order history found</div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default OrderStatusPage;
