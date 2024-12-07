// frontend/src/forms/manage-restaurant-form/ManageRestaurantForm.tsx

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
        deliveryPrice: z.coerce.number().optional(),
        deliveryTime: z.coerce.number().optional(),
      })
    )
    .min(1, { message: "At least one branch is required" }),
  country: z.string({ required_error: "Country is required" }),
  wholesale: z.boolean().optional(),
  cuisines: z.array(z.string()).nonempty({ message: "Select at least one cuisine" }),
  menuItems: z.array(
    z.object({
      name: z.string().min(1, "Menu item name is required"),
      price: z.coerce.number().min(0.01, "Price must be at least $0.01"), // Allow prices below $1
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
      branchesInfo: [
        {
          cities: "",
          branchName: "",
          latitude: 0,
          longitude: 0,
          deliveryPrice: 0,
          deliveryTime: 0,
        },
      ],
      country: "",
      wholesale: false,
      cuisines: [],
      menuItems: [{ name: "", price: 0, imageUrl: "", imageFile: undefined }],
      imageUrl: "",
      imageFile: undefined,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "branchesInfo",
  });

  useEffect(() => {
    if (restaurant) {
      form.reset({
        ...restaurant,
        branchesInfo: restaurant.branchesInfo.map((branch) => ({
          ...branch,
          deliveryPrice: branch.deliveryPrice , // Convert cents to dollars
          deliveryTime: branch.deliveryTime,
        })),
        menuItems: restaurant.menuItems.map((item) => ({
          ...item,
          price: item.price , // Convert cents to dollars
          imageFile: undefined, // Reset imageFile to allow uploading new images
        })),
      });
      replace(restaurant.branchesInfo.map((branch) => ({
        ...branch,
        deliveryPrice: branch.deliveryPrice ,
        deliveryTime: branch.deliveryTime,
      })));
    }
  }, [restaurant, form, replace]);

  const getStatusWidth = () => {
    switch (restaurant?.status) {
      case "submitted":
        return "33%";
      case "pending":
        return "66%";
      case "rejected":
        return "0%";
      case "approved":
        return "100%";
      default:
        return "33%";
    }
  };

  const onSubmit = async (data: RestaurantFormData) => {
    console.log("ManageRestaurantForm onSubmit - data:", data);
    // Create a new FormData instance
    const formData = new FormData();

    // Append basic restaurant information
    formData.append("restaurantName", data.restaurantName);
    formData.append("cellphone", data.cellphone);
    formData.append("country", data.country);
    formData.append("wholesale", data.wholesale ? "true" : "false"); // Append as string

    // Append branchesInfo
    data.branchesInfo.forEach((branch, index) => {
      formData.append(`branchesInfo[${index}][cities]`, branch.cities);
      formData.append(`branchesInfo[${index}][branchName]`, branch.branchName);
      formData.append(`branchesInfo[${index}][latitude]`, branch.latitude.toString());
      formData.append(`branchesInfo[${index}][longitude]`, branch.longitude.toString());
      formData.append(`branchesInfo[${index}][deliveryPrice]`, (branch.deliveryPrice ?? 0).toString());
      formData.append(`branchesInfo[${index}][deliveryTime]`, (branch.deliveryTime ?? 0).toString());
    });

    // Append cuisines
    data.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });

    // Append menuItems with corrected field names for images
    data.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(`menuItems[${index}][price]`, menuItem.price.toString());

      if (menuItem.imageFile) {
        // Corrected field name with dot notation
        formData.append(`menuItems[${index}].menuItemImageFile`, menuItem.imageFile);
      } else if (menuItem.imageUrl) {
        formData.append(`menuItems[${index}][imageUrl]`, menuItem.imageUrl);
      }
    });

    // Append restaurant image with correct field name
    if (data.imageFile) {
      formData.append("restaurantImageFile", data.imageFile);
    } else if (data.imageUrl) {
      formData.append("imageUrl", data.imageUrl);
    }

    // Submit the form data
    onSave(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-50 p-10 rounded-lg">
        <DetailsSection restaurant={restaurant} currentUserEmail={currentUserEmail} />

        <Separator />
        <div className="space-y-4">
          <label className="block text-lg font-bold">Cities and Branches</label>
          <FormDescription>Enter details about cities, branches, and GPS coordinates.</FormDescription>

          <div className="hidden md:flex gap-2 font-bold items-center">
            <div className="w-1/6">City Name</div>
            <div className="w-1/6">Branch Name</div>
            <div className="w-1/6">Latitude</div>
            <div className="w-1/6">Longitude</div>
            <div className="w-1/6">Delivery Price</div>
            <div className="w-1/6">Delivery Time</div>
            <div className="w-1/6">Actions</div>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row gap-2 items-center">
              <input
                {...form.register(`branchesInfo.${index}.cities`)}
                className="border rounded p-2 w-full md:w-1/6 cursor-text"
                placeholder="City Name"
              />
              <input
                {...form.register(`branchesInfo.${index}.branchName`)}
                className="border rounded p-2 w-full md:w-1/6 cursor-text"
                placeholder="Branch Name"
              />
              <input
                {...form.register(`branchesInfo.${index}.latitude`, { valueAsNumber: true })}
                placeholder="Latitude"
                className="border rounded p-2 w-full md:w-1/6 cursor-ns-resize"
              />
              <input
                {...form.register(`branchesInfo.${index}.longitude`, { valueAsNumber: true })}
                placeholder="Longitude"
                className="border rounded p-2 w-full md:w-1/6 cursor-ew-resize"
              />
              <input
                {...form.register(`branchesInfo.${index}.deliveryPrice`, { valueAsNumber: true })}
                placeholder="Delivery Price ($)"
                className="border rounded p-2 w-full md:w-1/6 cursor-text"
              />
              <input
                {...form.register(`branchesInfo.${index}.deliveryTime`, { valueAsNumber: true })}
                placeholder="Delivery Time"
                className="border rounded p-2 w-full md:w-1/6 cursor-text"
              />
              <div className="w-full md:w-1/6">
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white text-xs px-2 py-1 cursor-pointer"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({
                cities: "",
                branchName: "",
                latitude: 0.0,
                longitude: 0.0,
                deliveryPrice: 0,
                deliveryTime: 0,
              })
            }
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
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
        <div className="mt-6">
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
            Restaurant Status:
          </label>
          <p className="text-xs text-gray-500">Your submission has been sent for admin approval.</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className={`bg-blue-600 h-2.5 rounded-full`} style={{ width: getStatusWidth() }}></div>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-2">
            <span>Submitted</span>
            <span>Pending Approval</span>
            <span>{restaurant?.status === "rejected" ? "Rejected" : "Approved"}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-start">
          {isLoading ? <LoadingButton /> : <Button type="submit" className="cursor-pointer">Submit</Button>}
        </div>
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
