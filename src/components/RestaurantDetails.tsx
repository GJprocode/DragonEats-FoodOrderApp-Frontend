import React from 'react';

interface Restaurant {
    restaurantName: string;
    city: string[];
    wholesale: boolean;
}

const RestaurantDetails = ({ restaurant }: { restaurant: Restaurant }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2">
            {/* Restaurant Name */}
            <h1 className="text-4xl font-bold mb-2">
                {restaurant.restaurantName}
            </h1>

            {/* Business Type */}
            <p className="text-sm text-gray-600">
                Business Type: {restaurant.wholesale ? 'Wholesaler' : 'Restaurant'}
            </p>

            {/* Cities */}
            <p className="text-sm text-gray-600">
                Cities: {restaurant.city.join(', ')}
            </p>
        </div>
    );
};

export default RestaurantDetails;
