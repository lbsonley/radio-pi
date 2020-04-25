import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import VolumeControls from "../Molecules/VolumeControls";
import PlaybackControlsPrimary from "../Molecules/PlaybackControlsPrimary";
import PlaybackControlsSecondary from "../Molecules/PlaybackControlsSecondary";
import { socketPropTypes } from "../../prop-types";

const Controls = ({ socket, minimum }) => {
  const handleClick = (payload) => {
    socket.emit("control", payload);
  };

  return (
    <Box component={Paper} elevation={10}>
      {minimum ? (
        <PlaybackControlsPrimary handleClick={handleClick} />
      ) : (
        <>
          <Box display="flex" flexDirection="column">
            <PlaybackControlsPrimary handleClick={handleClick} />
            <PlaybackControlsSecondary handleClick={handleClick} />
            <VolumeControls handleClick={handleClick} />
          </Box>
        </>
      )}
    </Box>
  );
};

Controls.defaultProps = {
  minimum: false,
};

Controls.propTypes = {
  socket: socketPropTypes.isRequired,
  minimum: PropTypes.bool,
};

export default Controls;
