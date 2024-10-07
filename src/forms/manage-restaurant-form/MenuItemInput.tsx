import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

type Props = {
  index: number;
  removeMenuItem: () => void;
};

const MenuItemInput = ({ index, removeMenuItem }: Props) => {
  const { control, setValue, watch } = useFormContext();
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const currentImageFile = watch(`menuItems.${index}.imageFile`);
  const existingImageUrl = watch(`menuItems.${index}.imageUrl`);

  useEffect(() => {
    if (existingImageUrl) {
      setImagePreview(existingImageUrl);
    }
  }, [existingImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue(`menuItems.${index}.imageFile`, file);
      setValue(`menuItems.${index}.imageUrl`, "");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(undefined);
    setValue(`menuItems.${index}.imageFile`, undefined);
    setValue(`menuItems.${index}.imageUrl`, "");
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        {imagePreview && (
          <img
            src={imagePreview}
            alt={`Preview of ${watch(`menuItems.${index}.name`) || "Menu Item"}`}
            className="w-20 h-20 object-contain rounded"
          />
        )}

        <div className="flex-1 flex flex-col md:flex-row gap-2 items-center">
          <FormField
            control={control}
            name={`menuItems.${index}.name`}
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel htmlFor={`menu-item-name-${index}`}>Menu Item Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={`menu-item-name-${index}`}
                    placeholder="e.g., Cheese Pizza"
                    className="bg-white"
                    maxLength={30}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`menuItems.${index}.price`}
            render={({ field }) => (
              <FormItem className="w-full md:w-1/4">
                <FormLabel htmlFor={`menu-item-price-${index}`}>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={`menu-item-price-${index}`}
                    placeholder="e.g., 9.99"
                    value={field.value}
                    inputMode="decimal"
                    pattern="^\d*(\.\d{0,2})?$"
                    className="bg-white"
                    maxLength={8}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 md:ml-2">
            <Button
              type="button"
              onClick={() => document.getElementById(`file-input-${index}`)?.click()}
              className="bg-blue-500 text-xs md:text-sm"
              aria-label="Add Image"
            >
              Add Image
            </Button>
            <input
              id={`file-input-${index}`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label={`Upload image for ${watch(`menuItems.${index}.name`) || "Menu Item"}`}
            />
            {currentImageFile && (
              <Button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-500 text-xs md:text-sm"
                aria-label="Remove Image"
              >
                Remove Image
              </Button>
            )}
            <Button
              type="button"
              onClick={removeMenuItem}
              className="bg-red-500 text-xs md:text-sm"
              aria-label="Remove Menu Item"
            >
              Remove Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemInput;
