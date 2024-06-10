// rfc or rfcp to get a react functional component 
// space our form fields out nicely
// In React, the syntax {...field}, is the 
// JavaScript spread operator to pass
// all the properties of the field object as props to the component. 
// Form library, + React Hook Form!
// chadCN library which uses the react hook form library to create error messages

// import {
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//   } from "../../components/ui/form";
// import { Input } from "../../components/ui/input";
// import React from "react";
//   import { useFormContext } from "react-hook-form";
  
//   const DetailsSection = () => {
//     const { control } = useFormContext();
//     return (
//       <div className="space-y-2">
//         <div>
//           <h2 className="text-2xl font-bold">Details</h2>
//           <FormDescription>
//             Enter the details about your restaurant
//           </FormDescription>
//         </div>
//         <FormField
//           control={control}
//           name="restaurantName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input {...field} className="bg-white" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="flex gap-4">
//           <FormField
//             control={control}
//             name="city"
//             render={({ field }) => (
//               <FormItem className="flex-1">
//                 <FormLabel>City</FormLabel>
//                 <FormControl>
//                   <Input {...field} className="bg-white" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={control}
//             name="country"
//             render={({ field }) => (
//               <FormItem className="flex-1">
//                 <FormLabel>Country</FormLabel>
//                 <FormControl>
//                   <Input {...field} className="bg-white" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
  
//         <FormField
//           control={control}
//           name="deliveryPrice"
//           render={({ field }) => (
//             <FormItem className="max-w-[25%]">
//               <FormLabel>Delivery price ($)</FormLabel>
//               <FormControl>
//                 <Input {...field} className="bg-white" placeholder="1.50" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={control}
//           name="estimatedDeliveryTime"
//           render={({ field }) => (
//             <FormItem className="max-w-[25%]">
//               <FormLabel>Estimated Delivery Time (minutes)</FormLabel>
//               <FormControl>
//                 <Input {...field} className="bg-white" placeholder="0.00" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>
//     );
//   };
  
//   export default DetailsSection;

import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";

const DetailsSection = () => {
  const { control } = useFormContext();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Details</h2>
        <FormDescription>
          Enter the details about your restaurant
        </FormDescription>
      </div>
      <FormField
        control={control}
        name="restaurantName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input value={field.value} onChange={field.onChange} className="bg-white" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-4">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input value={field.value} onChange={field.onChange} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input value={field.value} onChange={field.onChange} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="deliveryPrice"
        render={({ field }) => (
          <FormItem className="max-w-[25%]">
            <FormLabel>Delivery price ($)</FormLabel>
            <FormControl>
              <Input value={field.value} onChange={field.onChange} className="bg-white" placeholder="1.50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="estimatedDeliveryTime"
        render={({ field }) => (
          <FormItem className="max-w-[25%]">
            <FormLabel>Estimated Delivery Time (minutes)</FormLabel>
            <FormControl>
              <Input value={field.value} onChange={field.onChange} className="bg-white" placeholder="0.00" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DetailsSection;
