// src/components/SearchResultCard.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { EnrichedBranch } from "../types";

type Props = {
  branch: EnrichedBranch;
};

const SearchResultCard = ({ branch }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(`Navigating to details page for restaurant: ${branch.restaurantId}`);
    navigate(`/detail/${branch.restaurantId}`); // Use restaurantId here
  };

  return (
    <div
      className="p-4 border border-gray-200 rounded-md hover:shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <div className="mb-2">
        <img
          src={branch.restaurantImageUrl}
          alt={`${branch.restaurantName} image`}
          className="rounded-md w-full h-32 object-cover"
        />
      </div>
      <h3 className="text-lg font-bold">{branch.restaurantName}</h3>
      <p className="text-sm text-gray-500">
        {branch.branchName} - {branch.cities}
      </p>
      <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
        {branch.cuisines.map((cuisine, index) => (
          <span key={index} className="bg-gray-100 px-2 py-1 rounded-md">
            {cuisine}
          </span>
        ))}
      </div>
      <div className="mt-3 text-sm">
        <p>{branch.wholesale ? "Wholesale" : "Restaurant"}</p>
        <p>{branch.estimatedDeliveryTime} mins flying time</p>
        <p>Delivery fee ${(branch.deliveryPrice / 100).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SearchResultCard;
