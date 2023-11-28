import React from "react";
import "./searchFriend.css"
import { Search } from "@mui/icons-material";

const SearchFriend = () => {
  return (
    <div className="conversationSearchBox">
      <label htmlFor="searchConvo" className="searchLabel">
        <Search/>
      </label>
      <input
        type="search"
        placeholder="Search Messenger"
        id="searchConvo"
        className="searchConversation"
      />
    </div>
  );
};

export default SearchFriend;
