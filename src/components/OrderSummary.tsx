import React from "react";
import { CartItem } from "@/pages/DetailPage";
import { Restaurant, Branch } from "@/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Trash } from "lucide-react";

type Props = {
  restaurant: Restaurant;
  branch: Branch | null;
  cartItems: CartItem[];
  removeFromCart: (cartItem: CartItem) => void;
};

const OrderSummary = ({ restaurant, branch, cartItems, removeFromCart }: Props) => {
  // If branch is null, default to 0
  const deliveryPrice = branch ? branch.deliveryPrice ?? 0 : 0;
  const deliveryTime = branch ? branch.deliveryTime ?? 0 : 0;

  const getTotalCost = () => {
    const totalInCents = cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );
    const totalWithDelivery = totalInCents + deliveryPrice;
    return (totalWithDelivery / 100).toFixed(2);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Order Summary</span>
        </CardTitle>
        <div className="flex flex-col mt-2">
          <span className="text-sm text-gray-600">
            Restaurant: {restaurant.restaurantName}
          </span>
          {branch && (
            <>
              <span className="text-sm text-gray-600">Branch: {branch.branchName}</span>
              <span className="text-sm text-gray-600">City: {branch.cities}</span>
            </>
          )}
          <span className="text-sm text-gray-600">
            Estimated Delivery: {deliveryTime} min
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between items-center">
            <span>
              {item.name} x{" "}
              <Badge variant="outline" className="mr-2">
                {item.quantity}
              </Badge>
            </span>
            <span className="flex items-center gap-1">
              <Trash
                className="cursor-pointer"
                color="red"
                size={20}
                onClick={() => removeFromCart(item)}
              />
              ${(item.price * item.quantity / 100).toFixed(2)}
            </span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <span>Delivery Cost:</span>
          <span>${(deliveryPrice / 100).toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${getTotalCost()}</span>
        </div>
      </CardContent>
    </>
  );
};

export default OrderSummary;
