// src/pages/SearchPage.tsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSearchRestaurants } from "../api/RestaurantApi";
import SearchResultInfo from "../components/SearchResultInfo";
import SearchResultCard from "../components/SearchResultCard";
import SearchBar, { SearchForm } from "../components/SearchBar";
import PaginationSelector from "../components/PaginationSelector";
import CuisineFilter from "../components/CuisineFilter";
import SortOptionDropdown from "../components/SortOptionDropdown";
import BusinessTypeFilter from "../components/BusinessTypeFilter";
import { Restaurant, Branch, EnrichedBranch } from "../types";

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  selectedBusinessType: string[];
  sortOption: string;
};

const SearchPage = () => {
  const { city } = useParams<{ city: string }>();
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
    selectedBusinessType: [],
    sortOption: "bestMatch",
  });

  const { results, isLoading } = useSearchRestaurants(searchState, city);

  if (isLoading) {
    return <span>Loading ...</span>;
  }

  if (!results?.data || !city) {
    console.warn("No results found for city:", city);
    return <span>No results found</span>;
  }

  // Use totalBranches from the server response
  const totalBranches = results.pagination.totalBranches || 0;

  // Process the results to display
  const filteredBranches: EnrichedBranch[] = results.data.flatMap((restaurant: Restaurant) =>
    (restaurant.branches || []).map((branch: Branch) => ({
      ...branch,
      restaurantId: restaurant._id, // Add this line
      restaurantImageUrl: restaurant.restaurantImageUrl || "placeholder.png",
      restaurantName: restaurant.restaurantName,
      cuisines: restaurant.cuisines,
      wholesale: restaurant.wholesale ?? false,
      estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
      deliveryPrice: restaurant.deliveryPrice,
    }))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="filter-list">
        <BusinessTypeFilter
          selectedBusinessType={searchState.selectedBusinessType}
          onChange={(selectedBusinessType) =>
            setSearchState((prevState) => ({
              ...prevState,
              selectedBusinessType,
              page: 1,
            }))
          }
          onReset={() =>
            setSearchState((prevState) => ({
              ...prevState,
              selectedBusinessType: [],
            }))
          }
        />
        <CuisineFilter
          selectedCuisines={searchState.selectedCuisines}
          onChange={(selectedCuisines) =>
            setSearchState((prevState) => ({
              ...prevState,
              selectedCuisines,
              page: 1,
            }))
          }
          isExpanded={false}
          onExpandedClick={() => {}}
        />
      </div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchBar
          searchQuery={searchState.searchQuery}
          onSubmit={(formData: SearchForm) =>
            setSearchState((prevState) => ({
              ...prevState,
              searchQuery: formData.searchQuery,
              page: 1,
            }))
          }
          placeHolder="Search by Cuisine/Restaurant"
          onReset={() =>
            setSearchState((prevState) => ({
              ...prevState,
              searchQuery: "",
              page: 1,
            }))
          }
        />
        <div className="flex justify-between flex-col gap-3 lg:flex-row">
          <SearchResultInfo totalBranches={totalBranches} city={city} />
          <SortOptionDropdown
            sortOption={searchState.sortOption}
            onChange={(sortOption) =>
              setSearchState((prevState) => ({
                ...prevState,
                sortOption,
                page: 1,
              }))
            }
          />
        </div>
        {filteredBranches.map((branch: EnrichedBranch) => (
          <SearchResultCard key={branch._id} branch={branch} />
        ))}
        <PaginationSelector
          page={searchState.page}
          pages={results.pagination.pages}
          onPageChange={(page) =>
            setSearchState((prevState) => ({
              ...prevState,
              page,
            }))
          }
        />
      </div>
    </div>
  );
};

export default SearchPage;
