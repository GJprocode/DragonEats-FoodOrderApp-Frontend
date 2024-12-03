import React, { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useGetMyRestaurant } from "@/api/MyRestaurantApi";  // Import the API hook

const RestaurantImage = () => {
  const { control, watch, setValue } = useFormContext();
  const { restaurant } = useGetMyRestaurant();  // Fetch restaurant data
  const existingImageUrl = watch("imageUrl");
  const [imagePreview, setImagePreview] = useState<string | undefined>(existingImageUrl);

  useEffect(() => {
    if (restaurant?.restaurantImageUrl) {
      setImagePreview(restaurant.restaurantImageUrl);
      setValue("imageUrl", restaurant.restaurantImageUrl);
    }
  }, [restaurant, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue("imageFile", file);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Restaurant Image</h2>
        <FormDescription>
          Add an image that will be displayed on your restaurant listing in the search results. Adding a new image will overwrite the existing one.
        </FormDescription>
      </div>

      <div className="flex flex-col gap-8 md:w-[50%]">
        {imagePreview && (
          <AspectRatio ratio={16 / 9} className="flex items-center justify-center overflow-hidden">
            <img
              src={imagePreview}
              className="rounded-md object-contain w-full h-full"
              alt="Uploaded"
            />
          </AspectRatio>
        )}
        <FormField
          control={control}
          name="imageFile"
          render={() => (
            <FormItem>
              <FormLabel>Upload a new image</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RestaurantImage;
