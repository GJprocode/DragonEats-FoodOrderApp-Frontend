import React from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { MenuItem as MenuItemType } from "../types";

type Props = {
  menuItem: MenuItemType;
  addToCart: (item: MenuItemType) => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
  // Ensure correct price formatting
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(menuItem.price / 100);

  return (
    <Card className="cursor-pointer p-4">
      <CardContent className="flex flex-col md:flex-row items-center md:items-start">
        <img
          src={menuItem.imageUrl || "/path/to/placeholder-image.jpg"}
          alt={menuItem.name}
          className="w-24 h-24 object-cover rounded-md mr-4 md:mr-4"
        />
        <div className="flex flex-col flex-1 text-center md:text-left mt-2 md:mt-0">
          <CardTitle className="text-lg font-semibold">{menuItem.name}</CardTitle>
          <div className="flex flex-col md:flex-row items-center gap-2 mt-1">
            <div className="text-lg font-bold">{formattedPrice}</div>
            <button
              onClick={() => addToCart(menuItem)}
              className="bg-blue-500 text-white py-1 px-3 rounded-sm hover:bg-blue-600 w-full md:w-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
