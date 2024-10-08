import { Order } from "@/types";
import { Separator } from "@/components/ui/separator";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  return (
    <div className="space-y-5">
      {/* User's Own Details */}
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
          {order.cartItems.map((item) => {
            const price = Number(item.price) || 0; // Defaults to 0 if price is invalid
            const totalItemPrice = ((price * item.quantity) / 100).toFixed(2);

            // Log to check if price and totalItemPrice are numbers
            console.log(
              `Item: ${item.name}, Price: ${price}, Quantity: ${item.quantity}, Total Item Price: ${totalItemPrice}`
            );

            return (
              <li key={item.menuItemId}>
                {item.name}: ${(price / 100).toFixed(2)} x {item.quantity} = ${totalItemPrice}
              </li>
            );
          })}
        </ul>
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
        <span>${(order.totalAmount / 100).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
