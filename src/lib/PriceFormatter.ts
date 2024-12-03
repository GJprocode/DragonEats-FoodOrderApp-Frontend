// C:\Users\gertf\Desktop\FoodApp\frontend\src\lib\PriceFormatter.ts

export const formatPrice = (price: number): string => {
  // Format the price to two decimal places and add currency symbol
  return `$${(price / 100).toFixed(2)}`;
  };