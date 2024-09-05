import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";

type DetailsSectionProps = {
  restaurant?: Restaurant | null;
  currentUserEmail: string; // Add currentUserEmail prop
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ restaurant, currentUserEmail }) => {
  const { control, setValue, getValues } = useFormContext();
  const [cities, setCities] = useState<string[]>(restaurant?.city || getValues("city") || [""]);

  useEffect(() => {
    if (restaurant?.city) {
      setCities(restaurant.city);
    }

    // Set the email field to the logged-in user's email
    setValue("email", currentUserEmail);
  }, [restaurant, currentUserEmail, setValue]);

  const addCity = () => {
    setCities([...cities, ""]);
  };

  const removeCity = (index: number) => {
    const updatedCities = cities.filter((_, i) => i !== index);
    setCities(updatedCities);
    setValue("city", updatedCities);
  };

  const handleCityChange = (index: number, value: string) => {
    const updatedCities = cities.map((city, i) =>
      i === index ? value : city
    );
    setCities(updatedCities);
    setValue("city", updatedCities);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Details</h2>
        <FormDescription>
          Enter the details about your restaurant
        </FormDescription>
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
                  value={field.value}
                  onChange={field.onChange}
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
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-white border-gray-300 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-4">
        {cities.map((city, index) => (
          <div key={index} className="flex items-center gap-4">
            <FormItem className="flex-1">
              <FormLabel>City {index + 1}</FormLabel>
              <FormControl>
                <Input
                  value={city}
                  onChange={(e) => handleCityChange(index, e.target.value)}
                  className={`bg-white border-gray-300 rounded-md ${!city ? 'border-red-500' : ''}`}
                />
              </FormControl>
              {!city && <FormMessage>City cannot be empty</FormMessage>}
            </FormItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeCity(index)}
              className="text-red-500"
              type="button" // This ensures the button doesn't submit the form
            >
              Remove
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addCity} type="button">
          Add City
        </Button>
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
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-white border-gray-300 rounded-md"
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
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-white border-gray-300 rounded-md"
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
