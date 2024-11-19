import React, { useState } from "react";
import { useGetRestaurant } from "@/api/RestaurantApi";
import { useLocation, useParams } from "react-router-dom";
import MenuItem from "@/components/MenuItem";
import { Card, CardFooter } from "@/components/ui/card";
import OrderSummary from "@/components/OrderSummary";
import CheckoutButton from "@/components/CheckoutButton";
import { MenuItem as MenuItemType, User, Branch } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCreateCheckoutSession } from "@/api/OrderApi";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

const DetailPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { state } = useLocation();
  const { branch } = state as { branch: Branch }; // Extract branch from state
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createCheckoutSession, isLoading: isCheckoutLoading } = useCreateCheckoutSession();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
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

      sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id
      );
      sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const onCheckout = async (userFormData: Partial<User>) => {
    if (!restaurant || !branch) return;

    const checkoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity,
        price: Number(cartItem.price),
      })),
      restaurantId: restaurant._id,
      branchId: branch._id,
      branchName: branch.branchName,
      deliveryDetails: {
        name: userFormData.name || "Unnamed",
        address: userFormData.address || "No Address",
        city: branch.cities, // Use the branch's city
        country: userFormData.country || "No Country",
        email: userFormData.email || "no-email@example.com",
        cellphone: userFormData.cellphone || "000-000-0000",
      },
    };

    try {
      const data = await createCheckoutSession(checkoutData);
      window.location.href = data.url;
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  if (isLoading || !restaurant) {
    return "Loading...";
  }

  return (
    <div className="flex flex-col gap-10 md:px-32">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.restaurantImageUrl}
          alt={`Image of ${restaurant.restaurantName}`}
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>

      {/* Restaurant Details */}
      <div className="text-center">
        <h2 className="text-3xl font-bold">{restaurant.restaurantName}</h2>
        <p className="text-lg text-gray-500">{branch.branchName}</p>
        <p className="text-gray-500">City: {branch.cities}</p>
        <p className="text-gray-600">
          Business Type: {restaurant.wholesale ? "Wholesaler" : "Restaurant"}
        </p>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Menu Section */}
        <div className="flex-1">
          <div className="text-2xl font-bold tracking-tight mb-4">Menu</div>
          <div className="flex flex-col gap-4">
            {restaurant.menuItems.map((menuItem: MenuItemType) => (
              <MenuItem
                key={menuItem._id}
                menuItem={menuItem}
                addToCart={() => addToCart(menuItem)}
              />
            ))}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-1/3 mt-4 lg:mt-[0.15rem]">
          <div className="text-2xl font-bold tracking-tight mb-2">Cart</div>
          <Card className="shadow-md pt-1 lg:pt-0">
            <OrderSummary
              restaurant={restaurant}
              branch={branch} // Pass branch to OrderSummary
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
              <CheckoutButton
                orderId="dummy-order-id"
                disabled={cartItems.length === 0}
                onCheckout={onCheckout}
                isLoading={isCheckoutLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
