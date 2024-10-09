import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
  // const navigate = useNavigate();
  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname      
      },
    });
  };

  const handleUserProfileSave = (userFormData: UserFormData) => {
    onCheckout(userFormData);
    // navigate("/order-status"); // Redirect to the order status page after saving the user profile.
  };
  

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-green-500 flex-1">
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
        <UserProfileForm
          currentUser={currentUser}
          onSave={handleUserProfileSave}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
