// C:\Users\gertf\Desktop\FoodApp\frontend\src\types.ts

// Updated User type to reflect changes from the backend
export type User = {
  _id: string;
  auth0Id: string[]; // Store multiple auth0Ids, matching the backend model
  email: string;
  name?: string;       // Optional, as per your schema
  address?: string;    // Optional
  city?: string;       // Optional
  country?: string;    // Optional
  role?: string;       // Optional, default is "user"
  cellphone?: string;  // Optional, for storing user's cellphone number
};

// Updated MenuItem type to match changes from the backend
export type MenuItem = {
  _id: string;          // Matches the _id field from mongoose in the backend
  name: string;
  price: number;
  imageUrl?: string;    // Optional imageUrl field
};

// Updated Restaurant type to reflect backend schema changes
export type Restaurant = {
  branchesInfo: any;
  _id: string;
  user: string;         // Reference to the user who owns the restaurant
  email?: string;       // Optional
  restaurantName: string;
  city: string[];       // Array of city names
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];   // Array of cuisine types
  menuItems: MenuItem[]; // Array of MenuItem objects
  restaurantImageUrl?: string; // Optional restaurant image URL
  lastUpdated: string;
  wholesale?: boolean;  // Optional, as per your schema
  status: "submitted" | "pending" | "approved" | "rejected";  // Enum for status
  contractId?: string;
  contractType?: string;  
  cellphone?: string;   // Optional cellphone field for the restaurant
};

export type OrderStatus = "placed" | "confirmed" | "paid" | "inProgress" | "outForDelivery" | "delivered";


// Updated Order type to reflect changes in Restaurant and User
export type Order = {
  _id: string;
  restaurant: Restaurant;  // Reference to the Restaurant type
  user: User;              // Reference to the User type
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: number;    // Changed to number for consistency
    price: number;       // Ensure this is a number and not optional
  }[];
  deliveryDetails: {
    name: string;
    address: string;
    city: string;
    email: string;
    cellphone: string;   // Changed to string for better flexibility
  };
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;     // The date when the order was placed
  dateDelivered?: string; // Optional, the date when the order was delivered
  restaurantID: string;
};



// For restaurant search results with pagination
export type RestaurantSearchResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
