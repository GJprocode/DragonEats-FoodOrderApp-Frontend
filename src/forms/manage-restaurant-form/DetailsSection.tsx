import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Restaurant } from "@/types";
import { calculateDeliveryDetails } from "@/lib/deliveryUtils"; // Utility function for delivery calculations

type DetailsSectionProps = {
  restaurant?: Restaurant | null;
  currentUserEmail?: string; // Add currentUserEmail prop
  userLocation?: { latitude: number; longitude: number }; // Add userLocation prop
};

const DetailsSection: React.FC<DetailsSectionProps> = ({
  restaurant,
  currentUserEmail,
  userLocation,
}) => {
  const { control, setValue, watch } = useFormContext();

  const branchesInfo = watch("branchesInfo"); // Watch branchesInfo array

  useEffect(() => {
    // Set the email field to the logged-in user's email
    setValue("email", currentUserEmail);

    // Pre-fill form values if restaurant data is provided
    if (restaurant) {
      setValue("restaurantName", restaurant.restaurantName || "");
      setValue("cellphone", restaurant.cellphone || "");
      setValue("country", restaurant.country || "");
      setValue("deliveryPrice", restaurant.deliveryPrice || 0);
      setValue("estimatedDeliveryTime", restaurant.estimatedDeliveryTime || 0);
      setValue(
        "branchesInfo",
        restaurant.branchesInfo.map(
          (
            branch: {
              cities: string;
              branchName: string;
              latitude: number;
              longitude: number;
            },
            index: number
          ) => ({
            cities: branch.cities,
            branchName: branch.branchName || `Branch ${index + 1}`,
            latitude: branch.latitude || 0.0,
            longitude: branch.longitude || 0.0,
          })
        )
      );
    }
  }, [restaurant, currentUserEmail, setValue]);

  useEffect(() => {
    if (branchesInfo && userLocation) {
      const { price, time, distance } = calculateDeliveryDetails(
        branchesInfo,
        userLocation,
        "restaurant" // Or "wholesale" depending on the use case
      );
      setValue("deliveryPrice", price);
      setValue("estimatedDeliveryTime", time);
    }
  }, [branchesInfo, userLocation, setValue]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Details</h2>
        <FormDescription>Enter the details about your restaurant</FormDescription>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  className="bg-gray-200 cursor-not-allowed" // Lock and grey out the field
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="restaurantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-white border-gray-300 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="cellphone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cellphone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  {...field}
                  className="bg-white border-gray-300 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-white border-gray-300 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="deliveryPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Price ($)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  className="bg-gray-200 cursor-not-allowed" // Lock and grey out the field
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="estimatedDeliveryTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Delivery Time (minutes)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  className="bg-gray-200 cursor-not-allowed" // Lock and grey out the field
                  placeholder="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="wholesale"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Wholesale</FormLabel>
            <FormControl>
              <Input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DetailsSection;
