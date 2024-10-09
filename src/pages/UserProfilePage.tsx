import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm, { UserFormData } from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
    const { currentUser, isLoading: isGetLoading } = useGetMyUser();
    const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

    const handleSubmit = async (data: UserFormData) => {
        try {
            await updateUser(data);
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
            currentUser={currentUser}  // Fixed prop name
            onSave={handleSubmit}
            isLoading={isUpdateLoading}
        />
    );
};

export default UserProfilePage;
