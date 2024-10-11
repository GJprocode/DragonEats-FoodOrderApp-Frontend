import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import axios from 'axios';

type UserOrderProfileFormProps = {
  onUpdate: (data: unknown) => void; // Adjust type if you have a specific structure
};

const UserOrderProfileForm: React.FC<UserOrderProfileFormProps> = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    cellphone: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/order-user/user-profile', {
          params: { userId: 'USER_ID_HERE' }, // Replace with actual user ID
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <form>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
      <input name="cellphone" value={formData.cellphone} onChange={handleChange} placeholder="Cellphone" />
      <Button onClick={handleSubmit}>Update User Order Info</Button>
    </form>
  );
};

export default UserOrderProfileForm;
