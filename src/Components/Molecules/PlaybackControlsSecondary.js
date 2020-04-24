import React from "react";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";

import Forward30Icon from '@material-ui/icons/Forward30';
import Replay30Icon from '@material-ui/icons/Replay30';

const PlaybackControlsSecondary = ({ handleClick }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-around"
    >
      <IconButton
        onClick={() => handleClick({ type: 'backward30' })}
        color="primary"
        aria-label="30 second backward"
      >
        <Replay30Icon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={() => handleClick({ type: 'forward30' })}
        color="primary"
        aria-label="30 seconds forward"
      >
        <Forward30Icon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default PlaybackControlsSecondary;
