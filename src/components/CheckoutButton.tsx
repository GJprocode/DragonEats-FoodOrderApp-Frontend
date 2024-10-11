// CheckoutButton.tsx
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import UserOrderProfileForm from "../forms/order-forms/UserOrderProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { User } from "@/types";

type Props = {
  onCheckout: (userFormData: User) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton: React.FC<Props> = ({
  onCheckout,
  disabled,
  isLoading,
}) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: pathname, // Redirect back to the cart page after login
      },
    });
  };

  const handleUserOrderUpdate = (data: User) => {
    onCheckout(data);
    navigate("/order-status", { replace: true }); // Redirect to the order status page after updating
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={handleLogin} className="bg-green-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || isLoading || isGetUserLoading) {
    return <LoadingButton />;
  }

  if (!currentUser) {
    return <p>Error: User not found</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="bg-green-500 flex-1">
          Go to checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <DialogTitle className="sr-only">Update Order Information</DialogTitle>
        <UserOrderProfileForm
          userId={currentUser._id}
          onUpdate={handleUserOrderUpdate}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
