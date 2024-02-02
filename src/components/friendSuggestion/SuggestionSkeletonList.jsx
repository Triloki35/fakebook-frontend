import { Skeleton } from '@mui/material';
import React from 'react';

const SuggestionSkelton = () => {
  return (
    <div className='suggestion-skeleton'>
      <Skeleton variant="circular" width={50} height={40} />
      <Skeleton variant="text" sx={{ fontSize: '.8rem', margin: "0px 5px" , width:"-webkit-fill-available"}} />
    </div>
  );
};

const SuggestionSkeletonList = () => {
  const skeletons = Array.from({ length: 5 }).map((_, index) => (
    <SuggestionSkelton key={index} />
  ));

  return <>{skeletons}</>;
};

export default SuggestionSkeletonList;
