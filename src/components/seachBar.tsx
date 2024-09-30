import { SearchBarProps } from "../types/types";
import "./searchBar.css";

const SearchBar = ({ searchInputValue, handleChangeSearch }: SearchBarProps) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search tags..."
        value={searchInputValue}
        onChange={(e) => handleChangeSearch(e.target.value)}
        className="search-bar-input"
      />
      <button className="search-bar-button">Search</button>
    </div>
  );
};

export default SearchBar;
