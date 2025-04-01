import React from "react";
import LunchQuestLogo from "../../assets/lunchquest.png";
import SearchBar from "../SearchBar/SearchBar";

const Header = ({ search, setSearch, handleSearch }) => {
  return (
    <header className="w-full sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center justify-center md:justify-start mb-3 md:mb-0">
          <img src={LunchQuestLogo} className="h-50 w-auto md:h-6" alt="Logo" />
        </div>
        <div className="w-full md:max-w-md">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
