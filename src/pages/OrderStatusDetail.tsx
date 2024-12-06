import React from "react";
import { Order } from "@/types";
import { Separator } from "@/components/ui/separator";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
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
    // Use branchDetails for deliveryPrice and time. Default to 0 if missing
    const deliveryPrice = order.branchDetails?.deliveryPrice ?? 0;
    return ((itemsTotal + deliveryPrice) / 100).toFixed(2);
  };

  const deliveryPrice = order.branchDetails?.deliveryPrice ?? 0;
  const deliveryTime = order.branchDetails?.deliveryTime ?? 0;

  return (
    <div className="space-y-5">
      {/* User's Delivery Details */}
      <div className="flex flex-col">
        <span className="font-bold">Delivering to:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.address}, {order.deliveryDetails.city}
        </span>
        <span>{order.deliveryDetails.cellphone}</span>
      </div>

      <Separator className="my-3 border-t border-gray-400" />

      {/* Order Details */}
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <span className="font-bold">
          Restaurant: {order.restaurantName}
        </span>
        <div className="flex flex-col">
          <span className="font-bold">Branch:</span>
          <span>{order.branchDetails?.branchName}, {order.branchDetails?.city}</span>
        </div>
        <span className="font-bold">
          Restaurant Cell: {order.deliveryDetails.cellphone}
        </span>
        <ul>
          {order.cartItems.map((item) => (
            <li key={item.menuItemId}>
              {item.name}: ${(item.price / 100).toFixed(2)} x {item.quantity} = ${((item.price * item.quantity) / 100).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Order Date Information */}
      <div className="flex flex-col">
        <div>
          <strong>Ordered on:</strong> {formatDate(order.createdAt)}
        </div>
        {order.status === "delivered" && order.dateDelivered && (
          <div>
            <strong>Delivered on:</strong> {formatDate(order.dateDelivered)}
          </div>
        )}

      <div>
            <strong>Delivered on:</strong> {formatDate(order.dateDelivered)}
          </div>  
      </div>

       {/* Delivery Time */}
       <div className="flex flex-col">
        <span className="font-bold">Estimated Delivery Time:</span>
        <span>{deliveryTime} min</span>
      </div>

      <Separator className="my-3 border-t-2 border-gray-500" />

      {/* Delivery Cost */}
      <div className="flex flex-col">
        <span className="font-bold">Delivery Cost:</span>
        <span>${(deliveryPrice / 100).toFixed(2)}</span>
      </div>

     
      <Separator className="my-3 border-t-2 border-gray-500" />

      {/* Total Amount */}
      <div className="flex flex-col">
        <span className="font-bold">Total</span>
        <span>${calculateTotalAmount()}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
