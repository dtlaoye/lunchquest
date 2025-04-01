import React from "react";
import starIcon from "../../assets/star.svg";

const MarkerOverlay = ({ place }) => {
  if (!place) return null;

  return (
    <div className="flex bg-white shadow-md rounded-2xl overflow-hidden h-auto min-h-[100px] w-[320px]">
      <img
        src={
          place.photos?.[0]?.getUrl({ maxWidth: 400 }) ||
          "https://via.placeholder.com/80x80?text=No+Image"
        }
        alt={place.name}
        className="w-20 h-20 object-cover m-3"
      />
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <h2 className="text-lg font-semibold">{place.name}</h2>
          <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
            <img src={starIcon} alt="Star" className="w-4 h-4" />
            <span className="text-black">{place.rating?.toFixed(1)}</span>
            <span className="mx-1 text-black text-lg font-bold leading-none">
              ·
            </span>
            <span>({place.user_ratings_total?.toLocaleString() || 0})</span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{place.vicinity}</p>
        </div>
      </div>
    </div>
  );
};

export default MarkerOverlay;
