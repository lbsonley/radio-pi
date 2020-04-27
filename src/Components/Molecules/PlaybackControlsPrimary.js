import React, { useContext } from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayerContext from "../Contexts/PlayerContext";

const PlaybackControlsPrimary = ({ handleClick }) => {
  const playerState = useContext(PlayerContext);
  const { running, paused } = playerState;
  
  const PlayPauseButton = () => {
    if (paused) {
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
          aria-label="pause"
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
  handleClick: PropTypes.func.isRequired
};

export default PlaybackControlsPrimary;
