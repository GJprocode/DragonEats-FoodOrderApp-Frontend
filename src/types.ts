  // frontend/src/types.ts

  // Types reflecting the backend model
  // src/types.ts
  export type User = {
    _id: string;
    auth0Id: string[];
    email: string;
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    role?: string;
    cellphone?: string;
    userLocation?: [number, number]; // Array for [latitude, longitude]
  };

  // MenuItem type matching the backend model
  export type MenuItem = {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };

  // Branch type matching the branchesInfo schema
  export type Branch = {
    _id: string;
    cities: string;
    branchName: string;
    latitude: number;
    longitude: number;
    deliveryPrice: number; // Add deliveryPrice
    deliveryTime: number; // Add deliveryTime
  };

  export type EnrichedBranch = Branch & {
    restaurantId: string;
    restaurantImageUrl: string;
    restaurantName: string;
    cuisines: string[];
    wholesale: boolean;
    estimatedDeliveryTime: number;
    deliveryPrice: number;
  };

  // Restaurant type updated to reflect the backend schema
  export type Restaurant = {
    _id: string;
    restaurantName: string;
    branchesInfo: Branch[];
    branches?: Branch[]; // Optional, for filtered branches
    country: string;
    // deliveryPrice: number;  deleted is under branches
    // estimatedDeliveryTime: number; deleted is under branches
    cuisines: string[];
    menuItems: MenuItem[];
    restaurantImageUrl?: string;
    status: "submitted" | "pending" | "approved" | "rejected";
    contractType?: string;
    contractId?: string;
    lastUpdated?: string;
    user: string;
    wholesale?: boolean;
    email?: string;
    cellphone?: string;
  };

  // OrderStatus enum
  export type OrderStatus =
    | "placed"
    | "confirmed"
    | "paid"
    | "inProgress"
    | "outForDelivery"
    | "delivered"
    | "rejected"
    | "resolved";

  export type OrderMessage = {
    status: "rejected" | "resolved"; // Matches the enum in the schema
    message: string; // The content of the message
    timestamp: string; // ISO timestamp of when the message was added
  };
// check save(); unknown delete later 
  export type Order = {
    save(): unknown;
    _id: string;
    restaurant: Restaurant;
    restaurantName: string;
    branchDetails: {
      branchName: string;
      city: string;
      latitude: number;
      longitude: number;
      deliveryPrice?: number;
      deliveryTime?: number;
    };
    user: User;
    cartItems: {
      menuItemId: string;
      name: string;
      quantity: number;
      price: number;
    }[];
    deliveryDetails: {
      name: string;
      address: string;
      city: string;
      email: string;
      cellphone: string;
    };
    totalAmount: number;
    status: OrderStatus;
    messages?: OrderMessage[];
    rejectionMessage?: { message: string; timestamp: string };
    resolutionMessage?: { message: string; timestamp: string };
    dateDelivered?: string;
    createdAt: string;
    updatedAt?: string;
  };

  // Pagination interface updated to include totalBranches and totalRestaurants
  export interface Pagination {
    totalRestaurants: number;
    totalBranches: number;
    page: number;
    pages: number;
  }

  // RestaurantSearchResponse updated to use the new Pagination interface
  export interface RestaurantSearchResponse {
    data: Restaurant[];
    pagination: Pagination;
  }
