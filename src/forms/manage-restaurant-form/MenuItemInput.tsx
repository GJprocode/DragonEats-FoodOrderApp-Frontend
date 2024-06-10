// import { Button } from "../../components/ui/button";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../../components/ui/form";
// import { Input } from "../../components/ui/input";
// import React from "react";
// import { useFormContext } from "react-hook-form";

// type Props = {
//   index: number;
//   removeMenuItem: () => void;
// };

// const MenuItemInput = ({ index, removeMenuItem }: Props) => {
//   const { control } = useFormContext();

//   return (
//     <div className="flex flex-row items-end gap-2">
//       <FormField
//         control={control}
//         name={`menuItems.${index}.name`}
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel className="flex items-center gap-1">
//               Name <FormMessage />
//             </FormLabel>
//             <FormControl>
//               <Input
//                 {...field}
//                 placeholder="Enter Food item"
//                 className="bg-white"
//               />
//             </FormControl>
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={control}
//         name={`menuItems.${index}.price`}
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel className="flex items-center gap-1">
//               Price ($) <FormMessage />
//             </FormLabel>
//             <FormControl>
//               <Input {...field} placeholder="0.00" className="bg-white" />
//             </FormControl>
//           </FormItem>
//         )}
//       />
//       <Button
//         type="button"
//         onClick={removeMenuItem}
//         className="bg-red-500 max-h-fit"
//       >
//         Remove
//       </Button>
//     </div>
//   );
// };

// export default MenuItemInput;

// key: value to adress Warning: Each child in a list should have a unique "key" prop
// if works can deploy as is and debug and merge new branch, keep old, 
// frontend\src\config\restaurant-options-config.tsx
// frontend\src\forms\manage-restaurant-form\CuisinesSection.tsx
// frontend\src\forms\manage-restaurant-form\CuisineCheckbox.tsx
// frontend\src\forms\manage-restaurant-form\MenuItemInput.tsx
// frontend\src\forms\manage-restaurant-form\MenuSection.tsx



import { Button } from "../../components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  index: number;
  removeMenuItem: () => void;
};

const MenuItemInput = ({ index, removeMenuItem }: Props) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-row items-end gap-2">
      <FormField
        control={control}
        name={`menuItems.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Name <FormMessage />
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter Food item"
                className="bg-white"
              />
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
              <Input {...field} placeholder="0.00" className="bg-white" />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        type="button"
        onClick={removeMenuItem}
        className="bg-red-500 max-h-fit"
      >
        Remove
      </Button>
    </div>
  );
};

export default MenuItemInput;
