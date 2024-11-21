

//C:\Users\gertf\Desktop\FoodApp\frontend\src\pages\OrderStatusDetail.tsx

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
    const deliveryPrice = order.restaurant.deliveryPrice || 0;
    return ((itemsTotal + deliveryPrice) / 100).toFixed(2);
  };
  

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

      {/* Order Details */}
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <span className="font-bold">
          Restaurant: {order.restaurant.restaurantName}
        </span>
        <span className="font-bold">
          Restaurant Cell: {order.restaurant.cellphone}
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
      </div>

          <div className="flex flex-col">
            <span className="font-bold">Order Messages:</span>
              {order.messages.map((msg, index) => (
                <div key={index}>
                  <strong>Status:</strong> {msg.status} <br />
                  <strong>Message:</strong> {msg.message} <br />
                <strong>Timestamp:</strong> {new Date(msg.timestamp).toLocaleString()}
              </div>
            ))}
          </div>


      {/* Delivery Cost */}
      <div className="flex flex-col">
        <span className="font-bold">Delivery Cost:</span>
        <span>${(order.restaurant.deliveryPrice / 100).toFixed(2)}</span>
      </div>

      <Separator />

      {/* Total Amount */}
      <div className="flex flex-col">
        <span className="font-bold">Total</span>
        <span>${calculateTotalAmount()}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetail;


