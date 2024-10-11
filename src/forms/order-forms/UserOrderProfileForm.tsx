// UserOrderProfileForm.tsx
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchUserProfile } from '@/api/OrderUserApi';
import { User } from '@/types';

const formSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  cellphone: z.string().min(1, 'Cellphone is required'),
});

type UserOrderProfileFormProps = {
  userId: string;
  onUpdate: (data: User) => void;
  isLoading: boolean;
};

const UserOrderProfileForm: React.FC<UserOrderProfileFormProps> = ({
  userId,
  onUpdate,
  isLoading,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const form = useForm<User>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      address: '',
      city: '',
      cellphone: '',
    },
  });

  useEffect(() => {
    const fetchAndPopulateUser = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const userData = await fetchUserProfile(userId, accessToken);
        form.reset({
          email: userData.email || '',
          name: userData.name || '',
          address: userData.address || '',
          city: userData.city || '',
          cellphone: userData.cellphone || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchAndPopulateUser();
  }, [userId, getAccessTokenSilently, form]);

  const onSubmit = (data: User) => {
    onUpdate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              {...form.register('email')}
              placeholder="Email"
              readOnly
              className="bg-gray-200 cursor-not-allowed"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...form.register('name')} placeholder="Name" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input {...form.register('address')} placeholder="Address" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>City</FormLabel>
          <FormControl>
            <Input {...form.register('city')} placeholder="City" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Cellphone</FormLabel>
          <FormControl>
            <Input {...form.register('cellphone')} placeholder="Cellphone" />
          </FormControl>
        </FormItem>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Update Order Info'}
        </Button>
      </form>
    </Form>
  );
};

export default UserOrderProfileForm;
