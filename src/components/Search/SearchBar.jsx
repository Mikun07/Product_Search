import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ handleSearch }) => {
  return (
    <div className="relative">
      <div className="bg-slate-200 relative rounded-lg h-10 p-4 shadow-md flex items-center" data-testid="search-bar">
        <AiOutlineSearch className="text-primary cursor-pointer" />
        <input
          className="bg-transparent ring-gray-600 outline-none text-sm lg:w-48 w-36 ml-2 py-2 text-black placeholder:text-gray-800"
          type="text"
          placeholder="Search..."
          onChange={(e) => handleSearch(e)}
          aria-label="Search products"
          data-testid="search-input"
        />
      </div>
    </div>
  );
};

export default SearchBar;