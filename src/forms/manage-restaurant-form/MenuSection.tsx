// frontend/src/components/MenuSection.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import MenuItemInput from "./MenuItemInput";

const MenuSection = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Menu</h2>
        <FormDescription>
          Create your menu and give each item a name and a price. <br />
          Maximum of 40 items. Contact Admin for an increase.
        </FormDescription>
      </div>
      <FormField
        control={control}
        name="menuItems"
        render={() => (
          <FormItem className="flex flex-col gap-4">
            {fields.map((item, index) => (
              <MenuItemInput
                key={item.id}
                index={index}
                removeMenuItem={() => remove(index)}
              />
            ))}
          </FormItem>
        )}
      />
      <Button
        type="button"
        onClick={() =>
          append({ name: "", price: 0, imageFile: undefined, imageUrl: "" })
        }
        className="bg-green-600 text-white mt-4 md:mt-0 cursor-pointer"
      >
        Add Menu Item
      </Button>
    </div>
  );
};

export default MenuSection;
