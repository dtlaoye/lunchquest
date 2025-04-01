import React from "react";
import starIcon from "../../assets/star.svg";

const Card = ({
  title,
  description,
  rating,
  rating_count,
  imageUrl,
  cta,
  selected,
}) => {
  return (
    <div
      className={`flex bg-white shadow-md rounded-2xl overflow-hidden w-full border-2 ${
        selected ? "border-4 border-green-800" : "border-transparent"
      }`}
    >
      <img src={imageUrl} alt={title} className="w-20 h-20 object-cover m-3" />
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
            <img src={starIcon} alt="Star" className="w-4 h-4" />
            <span className="text-black">{rating?.toFixed(1)}</span>
            <span className="mx-1 text-black text-lg font-bold leading-none">
              ·
            </span>
            <span>({rating_count})</span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
