export type User = {
  _id: string;
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
};

export type MenuItem = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string; // Matches the backend field name
};

export type Restaurant = {
  _id: string;
  user: string;
  email: string;  // Add the email field here
  restaurantName: string;
  city: string[];
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[];
  restaurantImageUrl?: string;
  lastUpdated: string;
  wholesale: boolean;
  status: "submitted" | "pending" | "approved" | "rejected";
  contractId?: string;
  contractType?: string;
};

export type RestaurantSearchResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
