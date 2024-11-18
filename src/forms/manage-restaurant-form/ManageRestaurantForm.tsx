import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDescription } from "@/components/ui/form";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import RestaurantImage from "./RestaurantImage";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";

// Define the schema with Zod
const formSchema = z.object({
  restaurantName: z.string({ required_error: "Restaurant name is required" }),
  cellphone: z.string({ required_error: "Cellphone number is required" }),
  branchesInfo: z
    .array(
      z.object({
        cities: z.string({ required_error: "City name is required" }),
        branchName: z.string({ required_error: "Branch name is required" }),
        latitude: z.coerce.number({ invalid_type_error: "Latitude must be a number" }),
        longitude: z.coerce.number({ invalid_type_error: "Longitude must be a number" }),
      })
    )
    .min(1, { message: "At least one city is required" }),
  country: z.string({ required_error: "Country is required" }),
  deliveryPrice: z.coerce.number({
    required_error: "Delivery price is required",
    invalid_type_error: "Must be a valid number",
  }),
  estimatedDeliveryTime: z.coerce.number({
    required_error: "Estimated delivery time is required",
    invalid_type_error: "Must be a valid number",
  }),
  wholesale: z.boolean().optional(),
  cuisines: z.array(z.string()).nonempty({
    message: "Please select at least one cuisine",
  }),
  menuItems: z.array(
    z.object({
      name: z.string().min(1, "Menu item name is required"),
      price: z.coerce.number().min(1, "Price is required"),
      imageUrl: z.string().optional(),
      imageFile: z.instanceof(File).optional(),
    })
  ),
  imageUrl: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
});

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant | null;
  onSave: (formData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm: React.FC<Props> = ({ restaurant, onSave, isLoading }) => {
  const { user } = useAuth0();
  const currentUserEmail = user?.email || "";

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      cellphone: "",
      branchesInfo: [{ cities: "", branchName: "", latitude: 0.3345, longitude: 103.8669 }],
      country: "",
      deliveryPrice: undefined,
      estimatedDeliveryTime: undefined,
      wholesale: false,
      cuisines: [],
      menuItems: [{ name: "", price: 0, imageUrl: "", imageFile: undefined }],
      imageUrl: "",
      imageFile: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "branchesInfo",
  });

  useEffect(() => {
    if (restaurant) {
      const updatedRestaurant = {
        ...restaurant,
        branchesInfo: restaurant.branchesInfo?.length
          ? restaurant.branchesInfo // Use existing branchesInfo if available
          : [
              {
                cities: "Default City",
                branchName: "Default Branch",
                latitude: 0.0,
                longitude: 0.0,
              },
            ], // Default value for branchesInfo
        menuItems: restaurant.menuItems?.length
          ? restaurant.menuItems
          : [
              {
                name: "Default Item",
                price: 0,
                imageUrl: "",
              },
            ], // Default value for menu items
      };
      form.reset(updatedRestaurant);
    }
  }, [restaurant, form]);
  
  
  
  

  const onSubmit = async (data: RestaurantFormData) => {
    const formData = new FormData();
    formData.append("restaurantName", data.restaurantName);
    formData.append("cellphone", data.cellphone);
    formData.append("country", data.country);
    formData.append("deliveryPrice", data.deliveryPrice.toString());
    formData.append("estimatedDeliveryTime", data.estimatedDeliveryTime.toString());
  
    data.branchesInfo.forEach((branch, index) => {
      formData.append(`branchesInfo[${index}][cities]`, branch.cities);
      formData.append(`branchesInfo[${index}][branchName]`, branch.branchName);
      formData.append(`branchesInfo[${index}][latitude]`, branch.latitude.toString());
      formData.append(`branchesInfo[${index}][longitude]`, branch.longitude.toString());
    });
    
  
    data.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
  
    data.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(`menuItems[${index}][price]`, menuItem.price.toString());
      if (menuItem.imageFile) {
        formData.append(`menuItems[${index}][imageFile]`, menuItem.imageFile);
      } else if (menuItem.imageUrl) {
        formData.append(`menuItems[${index}][imageUrl]`, menuItem.imageUrl);
      }
    });
  
    if (data.imageFile) {
      formData.append("imageFile", data.imageFile);
    } else if (data.imageUrl) {
      formData.append("imageUrl", data.imageUrl);
    }
  
    onSave(formData);
  };
  
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection restaurant={restaurant} currentUserEmail={currentUserEmail} />
        <Separator />

              <div className="space-y-4">
        <label className="block text-lg font-bold">Cities and Branches</label>
        <FormDescription>Enter details about cities, branches, and GPS coordinates.</FormDescription>
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col md:flex-row gap-2 items-center">
            <input
              {...form.register(`branchesInfo.${index}.cities`)} // Use `cities` for city name
              className="border rounded p-2"
              placeholder="City Name"
              defaultValue={field.cities || ""}
            />
            <input
              {...form.register(`branchesInfo.${index}.branchName`)}
              className="border rounded p-2"
              placeholder="Branch Name"
              defaultValue={field.branchName || ""}
            />
            <input
              {...form.register(`branchesInfo.${index}.latitude`, { valueAsNumber: true })}
              placeholder="Latitude (e.g., 0.3345)"
              className="border rounded p-2"
              defaultValue={field.latitude || 0.0}
            />
            <input
              {...form.register(`branchesInfo.${index}.longitude`, { valueAsNumber: true })}
              placeholder="Longitude (e.g., 103.8669)"
              className="border rounded p-2"
              defaultValue={field.longitude || 0.0}
            />
            <Button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 text-white text-xs px-2 py-1"
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({ cities: "", branchName: "", latitude: 0.0, longitude: 0.0 })
          }
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Branch
        </Button>
      </div>


        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <RestaurantImage />
        <Separator />
        <div className="flex justify-start">
          {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
        </div>
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
