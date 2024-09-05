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

      // Clear the existing image URL when a new file is selected
      setValue(`menuItems.${index}.imageUrl`, "");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(undefined);
    setValue(`menuItems.${index}.imageFile`, undefined);
    setValue(`menuItems.${index}.imageUrl`, ""); // Clear the URL when removing the image
  };

  return (
    <div className="flex flex-row items-end gap-2">
      <FormField
        control={control}
        name={`menuItems.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Menu Item Name <FormMessage />
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Cheese Pizza" className="bg-white" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`menuItems.${index}.price`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Price ($) <FormMessage />
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value}
                inputMode="decimal"
                pattern="^\d*(\.\d{0,2})?$" // Ensure two decimal places
                className="bg-white"
                placeholder="0.00"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex items-center gap-2">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-contain rounded"
          />
        )}
        <Button
          type="button"
          onClick={() => document.getElementById(`file-input-${index}`)?.click()}
          className="bg-blue-500"
        >
          Add Image
        </Button>
        <input
          id={`file-input-${index}`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          title={`Upload image for ${watch(`menuItems.${index}.name`) || "Menu Item"}`}
        />
        {currentImageFile && (
          <Button
            type="button"
            onClick={handleRemoveImage}
            className="bg-red-500"
          >
            Remove Image
          </Button>
        )}
        <Button
          type="button"
          onClick={removeMenuItem}
          className="bg-red-500 max-h-fit"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default MenuItemInput;