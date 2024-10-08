import React, { useEffect } from "react";
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
import { useAuth0 } from "@auth0/auth0-react";

// Define the schema with Zod
const formSchema = z.object({
  restaurantName: z.string({ required_error: "Restaurant name is required" }),
  cellphone: z.string({ required_error: "Cellphone number is required" }),
  city: z
    .array(z.string())
    .nonempty({ message: "At least one city is required" }),
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
});

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant | null;
  onSave: (formData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm: React.FC<Props> = ({
  onSave,
  isLoading,
  restaurant,
}) => {
  const { user } = useAuth0();
  const currentUserEmail = user?.email || "";

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      cellphone: " 0 ",
      city: [""],
      country: "",
      deliveryPrice: 0,
      estimatedDeliveryTime: 0,
      wholesale: false,
      cuisines: [],
      menuItems: [{ name: "", price: 0, imageFile: undefined, imageUrl: "" }],
      imageUrl: "",
      imageFile: undefined,
    },
  });

  useEffect(() => {
    if (restaurant) {
      const deliveryPriceFormatted = parseFloat(
        (restaurant.deliveryPrice / 100).toFixed(2)
      );
      const menuItemsFormatted = restaurant.menuItems.map((item) => ({
        ...item,
        price: parseFloat((item.price / 100).toFixed(2)),
      }));

      const updatedRestaurant = {
        ...restaurant,
        deliveryPrice: deliveryPriceFormatted,
        menuItems: menuItemsFormatted,
        city: Array.isArray(restaurant.city)
          ? restaurant.city
          : [restaurant.city],
        cellphone: restaurant.cellphone, // Ensure this is included
      };

      form.reset(updatedRestaurant);
    }
  }, [restaurant, form]);

  const onSubmit = async (formDataJson: RestaurantFormData) => {
    const formData = new FormData();
    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append('cellphone', formDataJson.cellphone.trim()); // Trim to remove any leading/trailing whitespace
    formDataJson.city.forEach((city, index) => {
      formData.append(`city[${index}]`, city);
    });

    formData.append("country", formDataJson.country);
    formData.append(
      "deliveryPrice",
      (formDataJson.deliveryPrice * 100).toFixed(2)
    );
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString()
    );
    formData.append("wholesale", formDataJson.wholesale ? "true" : "false");
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });

    formDataJson.menuItems.forEach((menuItem, index) => {
      if (menuItem.name && menuItem.price) {
        formData.append(`menuItems[${index}][name]`, menuItem.name);
        formData.append(
          `menuItems[${index}][price]`,
          (menuItem.price * 100).toFixed(2)
        );
        if (menuItem.imageFile) {
          formData.append(
            `menuItems[${index}].menuItemImageFile`,
            menuItem.imageFile
          );
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

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection
          restaurant={restaurant}
          currentUserEmail={currentUserEmail}
        />

        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <RestaurantImage />
        <Separator />
        <div className="mt-6">
          <label
            htmlFor="progress"
            className="block text-sm font-medium text-gray-700"
          >
            Restaurant Status:
          </label>
          <p className="text-xs text-gray-500">
            Your submission has been sent for admin approval.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className={`bg-blue-600 h-2.5 rounded-full`}
              style={{ width: getStatusWidth() }}
            ></div>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-2">
            <span>Submitted</span>
            <span>Pending Approval</span>
            <span>
              {restaurant?.status === "rejected" ? "Rejected" : "Approved"}
            </span>
          </div>
        </div>
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
