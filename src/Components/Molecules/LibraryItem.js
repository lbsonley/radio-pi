import React, { useState } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import Popper from "@material-ui/core/Popper";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { emitUpdateQueuePropTypes } from "../../prop-types";

const LibraryItem = ({ path, name, emitUpdateQueue }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const togglePlayPopper = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "play-popper" : undefined;

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      wrap="nowrap"
    >
      <Grid item xs>
        <span>{name}</span>
      </Grid>
      <Grid item xs>
        <ButtonGroup color="primary">
          <Button onClick={togglePlayPopper}>
            <PlayArrowIcon />
          </Button>
          <Button
            onClick={() =>
              emitUpdateQueue({
                type: "addItemAtEnd",
                name,
                path,
              })}
          >
            <PlaylistAddIcon />
          </Button>
        </ButtonGroup>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            variant="contained"
          >
            <Button
              onClick={(e) => {
                togglePlayPopper(e);
                emitUpdateQueue({
                  type: "addItemNext",
                  name,
                  path,
                });
              }}
            >
              <Typography variant="body2">Play Next</Typography>
            </Button>
            <Button
              onClick={(e) => {
                togglePlayPopper(e);
                emitUpdateQueue({
                  type: "addItemNextAndPlay",
                  name,
                  path,
                });
              }}
            >
              <Typography variant="body2">Play Now</Typography>
            </Button>
          </ButtonGroup>
        </Popper>
      </Grid>
    </Grid>
  );
};

LibraryItem.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  emitUpdateQueue: emitUpdateQueuePropTypes.isRequired,
};

export default LibraryItem;
