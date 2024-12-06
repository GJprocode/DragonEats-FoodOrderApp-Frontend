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

type DetailsSectionProps = {
  restaurant?: Restaurant | null;
  currentUserEmail?: string;
};

const DetailsSection: React.FC<DetailsSectionProps> = ({
  restaurant,
  currentUserEmail,
}) => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    // console.log("DetailsSection useEffect - restaurant:", restaurant);
    // console.log("DetailsSection useEffect - currentUserEmail:", currentUserEmail);

    setValue("email", currentUserEmail || "");
    setValue("restaurantName", restaurant?.restaurantName || "");
    setValue("cellphone", restaurant?.cellphone || "");
    setValue("country", restaurant?.country || "");
    // Do NOT set branchesInfo here!
  }, [restaurant, currentUserEmail, setValue]);

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
                <Input {...field} readOnly className="bg-gray-200 cursor-not-allowed" />
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
                <Input {...field} className="bg-white border-gray-300 rounded-md" />
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
                <Input type="tel" {...field} className="bg-white border-gray-300 rounded-md" />
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
                <Input {...field} className="bg-white border-gray-300 rounded-md" />
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
                checked={!!field.value}
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
