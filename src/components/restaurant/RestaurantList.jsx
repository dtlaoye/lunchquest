import React from "react";
import Card from "./Card";

const RestaurantList = ({
  restaurants,
  selectedPlaceId,
  onSelect,
  showMap,
}) => {
  return (
    <div
      className={`w-full md:w-[600px] overflow-y-auto p-4 space-y-4 bg-gray-100 ${
        showMap ? "hidden md:block" : "block"
      }`}
    >
      {restaurants.length === 0 ? (
        <div className="text-center text-gray-500 text-sm mt-8">
          🔍 Searching for nearby restaurants...
        </div>
      ) : (
        restaurants.map((place) => (
          <div
            key={place.place_id}
            id={`card-${place.place_id}`}
            onClick={() => onSelect(place.place_id)}
          >
            <Card
              title={place.name}
              description={place.vicinity}
              imageUrl={
                place.photos?.[0]?.getUrl({ maxWidth: 400 }) ||
                "https://via.placeholder.com/400x300?text=No+Image"
              }
              selected={place.place_id === selectedPlaceId}
              rating={place.rating}
              rating_count={place.user_ratings_total}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default RestaurantList;
