import React from "react";
import searchIcon from "../../assets/searchicon.svg";

const SearchBar = ({ value, onChange, onSearch }) => {
  return (
    <div className="relative w-full max-w-md">
      <img
        src={searchIcon}
        alt="Search"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
        placeholder="Search restaurants"
        className="w-full pl-9 pr-4 py-1.5 rounded-full text-sm bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
};

export default SearchBar;
