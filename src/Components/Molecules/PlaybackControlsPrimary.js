import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";

const PlaybackControlsPrimary = ({ handleClick, playerState }) => {
  const { running, paused } = playerState;
  
  const PlayPauseButton = () => {
    if (running && paused) {
      return (
        <IconButton
          onClick={() => handleClick({ type: "resume" })}
          color="primary"
          aria-label="play"
        >
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      );
    } else if (running) {
      return (
        <IconButton
          onClick={() => handleClick({ type: "pause" })}
          color="primary"
          aria-label="play"
        >
          <PauseIcon fontSize="large" />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          onClick={() => handleClick({ type: "play" })}
          color="primary"
          aria-label="play"
        >
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      );
    }
  };

  return (
    <Box display="flex" justifyContent="space-around">
      <IconButton
        onClick={() => handleClick({ type: "playPrevious" })}
        color="primary"
        aria-label="previous song"
      >
        <SkipPreviousIcon fontSize="large" />
      </IconButton>
      <PlayPauseButton/>
      <IconButton
        onClick={() => handleClick({ type: "playNext" })}
        color="primary"
        aria-label="next song"
      >
        <SkipNextIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

PlaybackControlsPrimary.propTypes = {
  handleClick: PropTypes.func.isRequired,
  playerState: PropTypes.shape({
    running: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired
  }).isRequired
};

export default PlaybackControlsPrimary;
