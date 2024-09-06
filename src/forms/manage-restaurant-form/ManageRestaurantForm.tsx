import React from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import RestaurantImage from "./RestaurantImage";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";  
import { Restaurant } from "@/types";

const formSchema = z.object({
  restaurantName: z.string({ required_error: "Restaurant name is required" }),
  city: z.array(z.string()).nonempty({ message: "At least one city is required" }),
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
    message: "Please select at least one item",
  }),
  menuItems: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      price: z.coerce.number().min(1, "Price is required"),
      imageFile: z.instanceof(File).optional(),
      imageUrl: z.string().optional(),
    })
  ),
  imageUrl: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
  email: z.string().email("Invalid email address"), // Add the email field
});

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant | null;
  onSave: (formData: FormData) => void;
  isLoading: boolean;
  currentUserEmail: string; // Add currentUserEmail prop
};

const ManageRestaurantForm: React.FC<Props> = ({ onSave, isLoading, restaurant, currentUserEmail }) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: restaurant?.restaurantName || "",
      city: restaurant?.city || [""],
      country: restaurant?.country || "",
      deliveryPrice: restaurant?.deliveryPrice || 0,
      estimatedDeliveryTime: restaurant?.estimatedDeliveryTime || 0,
      wholesale: restaurant?.wholesale || false,
      cuisines: restaurant?.cuisines || [],
      menuItems: restaurant?.menuItems || [
        { name: "", price: 0, imageFile: undefined, imageUrl: "" },
      ],
      imageUrl: restaurant?.restaurantImageUrl || "",
      imageFile: undefined,
      email: currentUserEmail, // Use the logged-in user's email
    },
  });

  const onSubmit = async (formDataJson: RestaurantFormData) => {
    const formData = new FormData();
    formData.append("restaurantName", formDataJson.restaurantName);
    formDataJson.city.forEach((city, index) => {
      formData.append(`city[${index}]`, city);
    });
    formData.append("country", formDataJson.country);
    formData.append("deliveryPrice", formDataJson.deliveryPrice.toString());
    formData.append("estimatedDeliveryTime", formDataJson.estimatedDeliveryTime.toString());
    formData.append("wholesale", formDataJson.wholesale ? "true" : "false");
    formData.append("status", "pending"); // Add status here
  
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
  
    formDataJson.menuItems.forEach((menuItem, index) => {
      if (menuItem.name && menuItem.price) {
        formData.append(`menuItems[${index}][name]`, menuItem.name);
        formData.append(`menuItems[${index}][price]`, menuItem.price.toString());
        if (menuItem.imageFile) {
          formData.append(`menuItems[${index}].menuItemImageFile`, menuItem.imageFile);
        } else if (menuItem.imageUrl) {
          formData.append(`menuItems[${index}][imageUrl]`, menuItem.imageUrl);
        }
      }
    });
  
    if (formDataJson.imageFile) {
      formData.append("restaurantImageFile", formDataJson.imageFile);
    } else if (formDataJson.imageUrl) {
      formData.append("imageUrl", formDataJson.imageUrl);
    }
  
    formData.append("email", formDataJson.email); // Include email in formData
  
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection restaurant={restaurant} currentUserEmail={currentUserEmail} />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <RestaurantImage />
        <Separator />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
