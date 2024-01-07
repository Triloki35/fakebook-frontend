import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const Categories = ({setCategory}) => {
  const categories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];

  return (
    <>
      <Autocomplete
        disablePortal
        id="news-categories"
        options={categories}
        onChange={(event,category)=>{setCategory(category)}}
        size="small"
        sx={{ width: 250 }}
        renderInput={(params) => <TextField {...params} label="Categories" />}
      />
    </>
  );
};

export default Categories;
