  // import React, { useState } from "react";
  // import { useGetMyOrders, useCreateCheckoutSession } from "@/api/OrderApi";
  // import OrderStatusHeader from "../components/OrderStatusHeader";
  // import { AspectRatio } from "@/components/ui/aspect-ratio";
  // import OrderStatusDetail from "./OrderStatusDetail";
  // import {
  //   Tabs,
  //   TabsContent,
  //   TabsList,
  //   TabsTrigger,
  // } from "../components/ui/tabs";
  // import { Button } from "@/components/ui/button";
  // import { Dialog, DialogContent } from "../components/ui/dialog";
  // import { loadStripe } from "@stripe/stripe-js";

  // const OrderStatusPage = () => {
  //   const { orders, isLoading } = useGetMyOrders();
  //   const { createCheckoutSession } = useCreateCheckoutSession();
  //   const [filterDate, setFilterDate] = useState<string>("");
  //   const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  //   const handlePayNow = (orderId: string) => {
  //     setSelectedOrder(orderId); // Set the selected order ID to open the payment dialog
  //   };

  //   const proceedWithStripe = async () => {
  //     if (!selectedOrder) return;
    
  //     try {
  //       const order = orders?.find((order) => order._id === selectedOrder);
  //       if (!order || order.status !== "confirmed") {
  //         console.error("Order must be in 'confirmed' state to proceed with payment.");
  //         return;
  //       }
    
  //       const checkoutSessionRequest = {
  //         cartItems: order.cartItems,
  //         deliveryDetails: order.deliveryDetails,
  //         restaurantId: order.restaurant._id,
  //         orderId: order._id, // Include orderId to ensure the backend updates it properly
  //       };
    
  //       const response = await createCheckoutSession(checkoutSessionRequest);
  //       const { sessionId } = response;
    
  //       if (sessionId) {
  //         const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
  //         await stripe?.redirectToCheckout({ sessionId });
  //       }
  //     } catch (error) {
  //       console.error("Error initiating payment:", error);
  //     }
  //   };
    
    

  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (!orders || orders.length === 0) {
  //     return <div>No orders found</div>;
  //   }

  //   const activeOrders = orders.filter((order) => order.status !== "delivered");

  //   const orderHistory = orders.filter(
  //     (order) =>
  //       order.status === "delivered" ||
  //       order.status === "rejected" ||
  //       (order.status === "paid" && order.rejectionMessage)
  //   );
    

  //   return (
  //     <Tabs defaultValue="active-orders">
  //       <TabsList>
  //         <TabsTrigger value="active-orders">My Order Status</TabsTrigger>
  //         <TabsTrigger value="order-history">My Order History</TabsTrigger>
  //       </TabsList>

  //       <TabsContent
  //         value="active-orders"
  //         className="space-y-10 bg-gray-50 p-10 rounded-lg"
  //       >
  //         <h2 className="text-2xl font-bold">
  //           {activeOrders.length} active orders
  //         </h2>
  //         {activeOrders.map((order) => (
  //           <div key={order._id} className="space-y-10">
  //             <OrderStatusHeader order={order} />
  //             <div className="grid gap-10 md:grid-cols-2">
  //               <OrderStatusDetail order={order} />
  //               <AspectRatio ratio={16 / 5}>
  //                 <img
  //                   alt="image"
  //                   src={order.restaurant.restaurantImageUrl}
  //                   className="rounded-md object-cover h-full w-full"
  //                 />
  //               </AspectRatio>
  //             </div>
  //             {order.status === "confirmed" && (
  //               <div className="flex justify-end">
  //                 <Button
  //                   className="bg-green-500"
  //                   onClick={() => handlePayNow(order._id)}
  //                 >
  //                   Pay Now
  //                 </Button>
  //               </div>
  //             )}
  //           </div>
  //         ))}

  //         <Dialog
  //           open={!!selectedOrder}
  //           onOpenChange={() => setSelectedOrder(null)}
  //         >
  //           <DialogContent className="max-w-[425px] bg-gray-50">
  //             <h3 className="text-lg font-bold" id="dialog-title">
  //               Select Payment Method
  //             </h3>
  //             <p className="mt-2" id="dialog-description">
  //               Choose your preferred payment method:
  //             </p>
  //             <div className="flex flex-col space-y-4 mt-4">
  //               <Button className="bg-blue-500" onClick={proceedWithStripe}>
  //                 Pay with Stripe
  //               </Button>
  //               <Button className="bg-gray-300" disabled>
  //                 Pay with ABA (Coming Soon)
  //               </Button>
  //               <Button className="bg-gray-300" disabled>
  //                 Pay with Wing (Coming Soon)
  //               </Button>
  //             </div>
  //           </DialogContent>
  //         </Dialog>
  //       </TabsContent>

  //       <TabsContent
  //         value="order-history"
  //         className="space-y-10 bg-gray-50 p-10 rounded-lg"
  //       >
  //         <h2 className="text-2xl font-bold">
  //           {orderHistory.length} delivered orders
  //         </h2>
  //         <div>
  //           <label htmlFor="filter-date" className="font-bold">
  //             Filter by date:
  //           </label>
  //           <input
  //             type="date"
  //             id="filter-date"
  //             value={filterDate}
  //             onChange={(e) => setFilterDate(e.target.value)}
  //             className="ml-2 p-2 border border-gray-300 rounded"
  //           />
  //         </div>
  //         {orderHistory.map((order) => (
  //           <div key={order._id} className="space-y-10">
  //             <OrderStatusHeader order={order} />
  //             <div className="grid gap-10 md:grid-cols-2">
  //               <OrderStatusDetail order={order} />
  //               <AspectRatio ratio={16 / 5}>
  //                 <img
  //                   alt="image"
  //                   src={order.restaurant.restaurantImageUrl}
  //                   className="rounded-md object-cover h-full w-full"
  //                 />
  //               </AspectRatio>
  //             </div>
  //           </div>
  //         ))}
  //       </TabsContent>
  //     </Tabs>
  //   );
  // };

  // export default OrderStatusPage;
  import React, { useState } from "react";
  import { useGetMyOrders, useCreateCheckoutSession } from "@/api/OrderApi";
  import OrderStatusHeader from "../components/OrderStatusHeader";
  import { AspectRatio } from "@/components/ui/aspect-ratio";
  import OrderStatusDetail from "./OrderStatusDetail";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
  import { Button } from "@/components/ui/button";
  import { Dialog, DialogContent } from "../components/ui/dialog";
  import { loadStripe } from "@stripe/stripe-js";
  
  const OrderStatusPage = () => {
    const { orders, isLoading } = useGetMyOrders();
    const { createCheckoutSession } = useCreateCheckoutSession();
    const [filterDate, setFilterDate] = useState<string>("");
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
    const handlePayNow = (orderId: string) => {
      setSelectedOrder(orderId); // Set the selected order ID to open the payment dialog
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
          orderId: order._id, // Include orderId to ensure the backend updates it properly
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
  
    const activeOrders = orders?.filter((order) => order.status !== "delivered") || [];
    const orderHistory = orders?.filter(
      (order) =>
        order.status === "delivered" ||
        order.status === "rejected" ||
        (order.status === "paid" && order.rejectionMessage)
    ) || [];
  
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
          {orderHistory.length > 0 ? (
            orderHistory.map((order) => (
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
            ))
          ) : (
            <div>No order history found</div>
          )}
        </TabsContent>
      </Tabs>
    );
  };
  
  export default OrderStatusPage;
  
