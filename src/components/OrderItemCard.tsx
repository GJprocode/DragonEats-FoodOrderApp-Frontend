// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\OrderItemCard.tsx
// import { Order, OrderStatus } from "@/types";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Separator } from "./ui/separator";
// import { Badge } from "./ui/badge";
// import { Label } from "./ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { useUpdateMyRestaurantOrder } from "@/api/MyRestaurantApi";
// import { useEffect, useState } from "react";

// type Props = {
//   order: Order;
// };

// const OrderItemCard = ({ order }: Props) => {
//   const { updateRestaurantStatus, isLoading } = useUpdateMyRestaurantOrder();
//   const [status, setStatus] = useState<OrderStatus>(order.status);

//   useEffect(() => {
//     setStatus(order.status);
//   }, [order.status]);

//   const handleStatusChange = async (newStatus: OrderStatus) => {
//     try {
//       await updateRestaurantStatus({
//         orderId: order._id as string,
//         status: newStatus,
//       });
//       setStatus(newStatus);
//     } catch (error) {
//       console.error("Failed to update status:", error);
//     }
//   };

//   const formatDate = (date: string | undefined) => {
//     if (!date) return "N/A";
//     const dateObj = new Date(date);
//     return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
//   };

//   const calculateTotalAmount = () => {
//     const itemsTotal = order.cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//     const deliveryPrice = order.restaurant.deliveryPrice || 0;
//     return ((itemsTotal + deliveryPrice) / 100).toFixed(2);
//   };
  

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="grid md:grid-cols-4 gap-4 justify-between mb-3">
//           <div>
//             Customer Name:
//             <span className="ml-2 font-normal">
//               {order.deliveryDetails.name}
//             </span>
//           </div>
//           <div>
//             Delivery Address:
//             <span className="ml-2 font-normal">
//               {order.deliveryDetails.address}, {order.deliveryDetails.city}
//             </span>
//           </div>
//           <div>
//             Restaurant Contact:
//             <span className="ml-2 font-normal">
//               {order.restaurant.cellphone}
//             </span>
//           </div>
//           <div>
//             Total Cost:
//             <span className="ml-2 font-normal">
//               ${calculateTotalAmount()}
//             </span>
//           </div>
//         </CardTitle>
//         <Separator />
//       </CardHeader>
//       <CardContent className="flex flex-col gap-6">
//         {/* Order date and status */}
//         <div className="flex flex-col gap-2">
//           <div>
//             <strong>Ordered on:</strong> {formatDate(order.createdAt)}
//           </div>
//           {order.status === "delivered" && order.dateDelivered && (
//             <div>
//               <strong>Delivered on:</strong> {formatDate(order.dateDelivered)}
//             </div>
//           )}
//         </div>

//         {/* Cart items */}
//         <div className="flex flex-col gap-2">
//           {order.cartItems.map((cartItem) => (
//             <span key={cartItem.menuItemId}>
//               <Badge variant="outline" className="mr-2">
//                 {cartItem.quantity}
//               </Badge>
//               {cartItem.name} - ${(cartItem.price / 100).toFixed(2)}
//             </span>
//           ))}
//         </div>

//         {/* Order status */}
//         <div className="flex flex-col space-y-1.5">
//           <Label htmlFor="status">Order Status:</Label>
//           <Select
//             value={status}
//             disabled={isLoading}
//             onValueChange={(value) => handleStatusChange(value as OrderStatus)}
//           >
//             <SelectTrigger id="status">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent position="popper">
//               {["placed", "confirmed", "paid", "inProgress", "outForDelivery", "delivered"].map((status) => (
//                 <SelectItem key={status} value={status}>{status}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default OrderItemCard;


// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\OrderItemCard.tsx
import { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUpdateMyRestaurantOrder } from "@/api/MyRestaurantApi";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type Props = {
  order: Order;
};

const OrderItemCard = ({ order }: Props) => {
  const { updateRestaurantStatus, isLoading } = useUpdateMyRestaurantOrder();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === "rejected") {
      setIsDialogOpen(true);
    } else {
      try {
        await updateRestaurantStatus({
          orderId: order._id as string,
          status: newStatus,
        });
        setStatus(newStatus);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionMessage) {
      alert("Rejection message is required.");
      return;
    }
    try {
      await updateRestaurantStatus({
        orderId: order._id as string,
        status: "rejected",
        rejectionMessage,
      });
      setStatus("rejected");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to reject order:", error);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    const dateObj = new Date(date);
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  };

  const calculateTotalAmount = () => {
    const itemsTotal = order.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const deliveryPrice = order.restaurant.deliveryPrice || 0;
    return ((itemsTotal + deliveryPrice) / 100).toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="grid md:grid-cols-4 gap-4 justify-between mb-3">
          <div>
            Customer Name:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.name}
            </span>
          </div>
          <div>
            Delivery Address:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.address}, {order.deliveryDetails.city}
            </span>
          </div>
          <div>
            Restaurant Contact:
            <span className="ml-2 font-normal">
              {order.restaurant.cellphone}
            </span>
          </div>
          <div>
            Total Cost:
            <span className="ml-2 font-normal">${calculateTotalAmount()}</span>
          </div>
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div>
            <strong>Ordered on:</strong> {formatDate(order.createdAt)}
          </div>
          {order.status === "delivered" && order.dateDelivered && (
            <div>
              <strong>Delivered on:</strong> {formatDate(order.dateDelivered)}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {order.cartItems.map((cartItem) => (
            <span key={cartItem.menuItemId}>
              <Badge variant="outline" className="mr-2">
                {cartItem.quantity}
              </Badge>
              {cartItem.name} - ${(cartItem.price / 100).toFixed(2)}
            </span>
          ))}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="status">Order Status:</Label>
          <Select
            value={status}
            disabled={isLoading}
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              {[
                "placed",
                "confirmed",
                "paid",
                "inProgress",
                "outForDelivery",
                "delivered",
                "rejected",
              ].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Reject Order</DialogTitle>
          <Textarea
            placeholder="Enter rejection message"
            value={rejectionMessage}
            onChange={(e) => setRejectionMessage(e.target.value)}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading}
            >
              Reject Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrderItemCard;

