import React from "react";
import mapIcon from "../assets/map.svg";
import listIcon from "../assets/list.svg";

const FloatingToggleButton = ({ showMap, toggle }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 md:hidden">
      <button
        className="bg-green-800 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2"
        onClick={toggle}
      >
        <img src={showMap ? listIcon : mapIcon} alt="Toggle Icon" />
        <span>{showMap ? "List" : "Map"}</span>
      </button>
    </div>
  );
};

export default FloatingToggleButton;
