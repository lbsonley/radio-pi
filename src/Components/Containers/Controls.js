import React from 'react';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import IconButton from '@material-ui/core/IconButton';
import VolumeControls from "../Molecules/VolumeControls";
import PlaybackControlsPrimary from "../Molecules/PlaybackControlsPrimary";
import PlaybackControlsSecondary from "../Molecules/PlaybackControlsSecondary";


const Controls = ({ socket, minimum = false }) => {
  const handleClick = (payload) => {
    socket.emit('control', payload);
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

export default Controls;
