import React, { useState } from "react";
import { useGetRestaurant } from "../api/RestaurantApi";
import { useParams } from "react-router-dom";
import MenuItem from "../components/MenuItem";
import { Card, CardFooter } from "../components/ui/card";
import { MenuItem as MenuItemType } from "../types";
import OrderSummary from "../components/OrderSummary";
import CheckoutButton from "../components/CheckoutButton";


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
  
  const [cartItems, setCartItems] = useState<CartItem[]>(()=>{
    const storedCartItems = sessionStorage.getItem(`cartItems-${
      restaurantId}`);
      return storedCartItems ? JSON.parse(storedCartItems) : [];
  });
 

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

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
      JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id
      );

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
      JSON.stringify(updatedCartItems)
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
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
              <CheckoutButton
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default DetailPage;
