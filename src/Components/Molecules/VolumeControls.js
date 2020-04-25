import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

const VolumeControls = ({ handleClick }) => {
  return (
    <Box display="flex">
      <IconButton
        onClick={() => handleClick({ type: "volume", direction: "up" })}
        color="primary"
        aria-label="volume up"
      >
        <VolumeUpIcon />
      </IconButton>
      <IconButton
        onClick={() => handleClick({ type: "volume", direction: "down" })}
        color="primary"
        aria-label="volume down"
      >
        <VolumeDownIcon />
      </IconButton>
    </Box>
  );
};

VolumeControls.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default VolumeControls;
