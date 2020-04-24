import React from "react";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

const PlaybackControlsPrimary = ({ handleClick }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-around"
    >
      <IconButton
        onClick={() => console.log('prev')}
        color="primary"
        aria-label="previous song"
      >
        <SkipPreviousIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={() => handleClick({ type: 'play' })}
        color="primary"
        aria-label="play"
      >
        <PlayArrowIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={() => console.log('next')}
        color="primary"
        aria-label="next song"
      >
        <SkipNextIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default PlaybackControlsPrimary;
