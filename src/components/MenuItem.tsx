  import React from 'react';
  import { Card, CardContent, CardTitle } from './ui/card';
  import { MenuItem as MenuItemType } from '../types';

  type Props = {
    menuItem: MenuItemType;
    addToCart: (item: MenuItemType) => void;
  };

  const MenuItem = ({ menuItem, addToCart }: Props) => {
    const handleAddToCart = () => {
      addToCart(menuItem);
    };

    // Ensure correct price formatting
    const formattedPrice = (menuItem.price / 100).toFixed(2);

    return (
      <Card className="cursor-pointer p-4">
        <CardContent className="flex items-center">
          {menuItem.imageUrl ? (
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              className="w-24 h-24 object-cover rounded-md mr-4"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-md mr-4 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <div className="flex flex-col">
            <CardTitle className="text-lg font-semibold">{menuItem.name}</CardTitle>
            <div className="flex items-center gap-4 mt-1">
              <div className="text-lg font-bold">
                ${formattedPrice}  {/* Display the formatted price */}
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-blue-500 text-white py-1 px-3 rounded-sm hover:bg-blue-600"
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
