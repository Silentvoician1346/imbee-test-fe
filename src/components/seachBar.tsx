import { useState } from "react";
import { SearchBarProps } from "../types/types";
import "./searchBar.css";

const SearchBar = ({ searchInputValue, handleChangeSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search tags..."
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          handleChangeSearch(e.target.value);
        }}
        className="search-bar-input"
      />
      <button className="search-bar-button">Search</button>
    </div>
  );
};

export default SearchBar;
