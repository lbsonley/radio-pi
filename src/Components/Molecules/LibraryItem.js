import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";

const LibraryItem = ({ path, name, emitQueueUpdate }) => {

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
          <Button
            onClick={() => emitQueueUpdate({
              type: "playNext",
              name,
              path
            })}
          >
            <PlayArrowIcon />
          </Button>
          <Button>
            <PlaylistAddIcon
              onClick={() => emitQueueUpdate({
                type: "add",
                name,
                path
              })}
            />
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

LibraryItem.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  emitQueueUpdate: PropTypes.func.isRequired
};

export default LibraryItem;
