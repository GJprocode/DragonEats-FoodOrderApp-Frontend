import React from "react";
import { useNavigate } from "react-router-dom";
import { EnrichedBranch } from "../types";

type Props = {
  branch: EnrichedBranch;
};

const SearchResultCard = ({ branch }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(`Navigating to details page for branch: ${branch.branchName}`);
    navigate(`/detail/${branch.restaurantId}`, { state: { branch } });
  };

  // Use branch.deliveryPrice and branch.deliveryTime, defaulting to 0 if undefined
  const deliveryTime = branch.deliveryTime ?? 0;
  const deliveryPrice = branch.deliveryPrice ?? 0;

  return (
    <div
      className="p-4 border border-gray-200 rounded-md hover:shadow-md cursor-pointer flex flex-col lg:flex-row gap-4"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="w-full lg:w-1/3">
        <img
          src={branch.restaurantImageUrl}
          alt={`${branch.restaurantName} image`}
          className="rounded-md w-full h-32 lg:h-40 object-cover"
        />
      </div>

      {/* Details Section */}
      <div className="flex flex-col w-full lg:w-2/3">
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
          <p>{deliveryTime} mins flying time</p>
          <p>Delivery fee ${(deliveryPrice / 100).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
