// C:\Users\gertf\Desktop\FoodApp\frontend\src\types.ts

export type User = {
  _id: string;
  email: string;
  name?: string;  // Mark name as optional if not consistently required
  address?: string;  // Consistently mark optional fields
  city?: string;
  country?: string;
  role?: string;  // Mark role as optional to reflect Mongoose schema
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
  email?: string;  // Marked as optional to match Mongoose default
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



export interface AdminAction {
  _id: string;
  restaurantId: string;
  status: string;
  contractType?: string;
  contractId?: string;
  adminId: string;
}

export type RestaurantSearchResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
