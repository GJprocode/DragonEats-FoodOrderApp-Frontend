// OrderUserApi.tsx
import axios from 'axios';

export const fetchUserProfile = async (userId: string, accessToken: string) => {
  try {
    const response = await axios.get(`/api/order-user/user-profile`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateOrderDetails = async (orderId: string, data: unknown) => {
  try {
    const response = await axios.put(`/api/order-user/order-details/${orderId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating order details:', error);
    throw error;
  }
};
