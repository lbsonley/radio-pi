import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import VolumeControls from "../Molecules/VolumeControls";
import PlaybackControlsPrimary from "../Molecules/PlaybackControlsPrimary";
import PlaybackControlsSecondary from "../Molecules/PlaybackControlsSecondary";
import { socketPropTypes } from "../../prop-types";

const Controls = ({ socket, minimum }) => {
  const [playerState, setPlayerState] = useState({
    running: false,
    paused: false
  });
  
  const onPlayerState = (payload) => setPlayerState(payload);
  
  useEffect(() => {
    socket.on('playerState', onPlayerState);
    return () => socket.off('playerState', onPlayerState);
  }, []);
  
  const handleClick = (payload) => {
    socket.emit("control", payload);
  };

  return (
    <Box component={Paper} elevation={10}>
      {minimum ? (
        <PlaybackControlsPrimary
          handleClick={handleClick}
          playerState={playerState}
        />
      ) : (
        <>
          <Box display="flex" flexDirection="column">
            <PlaybackControlsPrimary
              handleClick={handleClick}
              playerState={playerState}
            />
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
  minimum: PropTypes.bool
};

export default Controls;
