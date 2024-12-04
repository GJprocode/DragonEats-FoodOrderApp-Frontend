// UserProfilePage.tsx
import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm, { UserFormData } from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetMyUser();
  const { mutateAsync: updateUser, isLoading: isUpdateLoading } = useUpdateMyUser(); // Use mutateAsync

  const handleSubmit = async (data: UserFormData) => {
    try {
      await updateUser(data); // Directly call mutateAsync as updateUser
      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  if (isGetLoading) {
    return <span>Loading...</span>;
  }

  if (!currentUser) {
    return <span>Unable to load user profile</span>;
  }

  return (
    <UserProfileForm
      currentUser={currentUser}
      onSave={handleSubmit}
      isLoading={isUpdateLoading}
    />
  );
};

export default UserProfilePage;
