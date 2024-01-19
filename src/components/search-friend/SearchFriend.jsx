import React, { useState, useEffect } from "react";
import "./searchFriend.css";
import { Search } from "@mui/icons-material";
import axios from "axios";
import { Avatar } from "@mui/material";
import { arrayBufferToBase64 } from "../../base64Converter";

const SearchFriend = ({ userId, setCurrentConversation, setMessengerCenterVisible }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(
          `${API}users/search-friends/${userId}/${searchQuery}`
        );
        console.log(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching friends:", error);
      }
    };

    if (searchQuery.trim() !== "") {
      handleSearch();
    } else {
      // Clear search results if the search query is empty
      setSearchResults([]);
    }
  }, [userId, searchQuery]);

  const handleClick = async(friend) => {
    try {
      const res = await axios.get(`${API}conversations/find/${userId}/${friend._id}`);
      setCurrentConversation(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="conversationSearchBox">
      <label htmlFor="searchConvo" className="searchLabel">
        <Search />
      </label>
      <input
        placeholder="Search Messenger"
        id="searchConvo"
        className="searchConversation"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Display search results */}
      {searchQuery && (
        <div className="sf-container">
          <ul className="sf-result-list">
            {searchResults.map((friend) => (
              <li className="sf-result-item" key={friend._id} onClick={()=>{handleClick(friend);setMessengerCenterVisible((prev)=>!prev)}}>
                <Avatar src={`data:image/jpeg;base64,${arrayBufferToBase64(friend?.profilePicture?.data)}`}/>
                <span>{friend.username}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchFriend;
