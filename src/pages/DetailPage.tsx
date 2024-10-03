import React, { useState } from "react";
import { useGetRestaurant } from "@/api/RestaurantApi";
import { useParams } from "react-router-dom";
import MenuItem from "@/components/MenuItem";
import { Card, CardFooter } from "@/components/ui/card";
import OrderSummary from "@/components/OrderSummary";
import CheckoutButton from "@/components/CheckoutButton";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { MenuItem as MenuItemType } from "@/types";
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
  const { restaurantId } = useParams();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createCheckoutSession, isLoading: isCheckoutLoading } =
    useCreateCheckoutSession();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    console.log(
      `Loaded cart items from sessionStorage for restaurant ${restaurantId}:`,
      storedCartItems
    );
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

      console.log("Cart items after adding:", updatedCartItems);
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

      console.log("Cart items after removing:", updatedCartItems);
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) {
      return;
    }

    const checkoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity,
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: userFormData.name,
        address: userFormData.address,
        city: userFormData.city,
        country: userFormData.country,
        email: userFormData.email as string,
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
    <div className="flex flex-col gap-10">
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
        <p className="text-gray-500">{restaurant.city.join(", ")}</p>
        <p className="text-gray-600">
          Business Type: {restaurant.wholesale ? "Wholesaler" : "Restaurant"}
        </p>
      </div>

      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem: MenuItemType) => (
            <MenuItem
              key={menuItem._id}
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>

        <div>
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
              <CheckoutButton
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
