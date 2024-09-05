import React, { useState, useEffect } from "react";
import { useGetRestaurant } from "@/api/RestaurantApi";
import { useParams } from "react-router-dom";
import MenuItem from "../components/MenuItem";
import { Card } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuItem as MenuItemType } from "../types";
import { Trash } from "lucide-react";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

interface Restaurant {
  _id: string;
  restaurantName: string;
  city: string[];
  wholesale: boolean;
  restaurantImageUrl?: string; // Allow undefined values
  deliveryPrice: number;
  menuItems: MenuItemType[];
}


const RestaurantDetails = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2">
      {/* Restaurant Name */}
      <h1 className="text-4xl font-bold mb-2">{restaurant.restaurantName}</h1>

      {/* Business Type */}
      <p className="text-sm text-gray-600">
        Business Type: {restaurant.wholesale ? "Wholesaler" : "Restaurant"}
      </p>

      {/* Cities */}
      <p className="text-sm text-gray-600">
        Cities: {restaurant.city.join(", ")}
      </p>
    </div>
  );
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    const cost = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalCost(cost);
  }, [cartItems]);

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      );

      let updatedCartItems;

      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            imageUrl: menuItem.imageUrl,
          },
        ];
      }
      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id
      );
      return updatedCartItems;
    });
  };

  if (isLoading || !restaurant) {
    return "Loading...";
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Restaurant Details */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl">
          <RestaurantDetails restaurant={restaurant} />

          {/* Restaurant Image */}
          <div className="w-full h-48 md:h-64 overflow-hidden rounded-md flex justify-center items-center">
            <img
              src={restaurant.restaurantImageUrl}
              alt="Restaurant"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Menu and Cart */}
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItem
              key={menuItem._id}
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>
        <div>
          <Card className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Cart: Order Summary</h2>
            <ul className="space-y-2">
              {cartItems.map((item) => (
                <li key={item._id} className="flex justify-between items-center">
                  <div>
                    {item.name} x {item.quantity}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(item)}
                      className="text-red-500"
                    >
                      <Trash />
                    </Button>
                    <span>${(item.price * item.quantity / 100).toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between">
                <span>Delivery Cost:</span>
                <span>${(restaurant.deliveryPrice / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span>${((totalCost + restaurant.deliveryPrice) / 100).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
