import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "../../components/ui/form";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";


const ImageSection = () => {
  const { control, watch } = useFormContext();
  const existingImageUrl = watch("imageUrl");

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Image</h2>
        <FormDescription>
          Add an image that will be displayed on your restaurant listing in the
          search results. Adding a new image will overwrite the existing one.
        </FormDescription>
      </div>
      
      <div className="flex flex-col gap-8 md:w-[50%]">
        {existingImageUrl && (
          <div className="relative max-w-full max-h-[400px] overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <div className="absolute inset-0">
                <img
                  src={existingImageUrl}
                  className="w-full h-full object-contain rounded-md"
                  alt="Restaurant Image"
                  title="Restaurant Image"
                />
              </div>
            </AspectRatio>
          </div>
        )}
        <FormField
          control={control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input
                  className="bg-white"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={(event) =>
                    field.onChange(
                      event.target.files ? event.target.files[0] : null
                    )
                  }
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

export default ImageSection;

// object-contain fits both horizontal and more importantly vertical images!
// do not use object-cover 