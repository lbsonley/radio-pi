import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import QueueMusicIcon from "@material-ui/icons/QueueMusic";
import PropTypes from "prop-types";
import styled from "styled-components";
import { libraryPropTypes } from "../../prop-types";

const MediaPanel = styled.div`
  max-width: 100vw;
  overflow-x: scroll;
  padding-bottom: 60px;
`;

const PaddedPaper = styled(Paper)`
  padding-top: ${(props) => (props.big ? "18px" : "12px")};
  background-color: transparent;
`;

const MediaItem = ({ name }) => (
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
        <Button>
          <PlayArrowIcon />
        </Button>
        <Button>
          <QueueMusicIcon />
        </Button>
      </ButtonGroup>
    </Grid>
  </Grid>
);

const MediaLibrary = ({ library, handleSelection }) => {
  const handleClick = (path, name) => {
    console.log(path, name);
    handleSelection({ path, name });
  };

  const renderTree = (nodes) => (
    <PaddedPaper elevation="0" big={!!nodes.children}>
      <TreeItem
        key={nodes.name}
        nodeId={nodes.name}
        label={
          nodes.children ? (
            <span>
              {nodes.name
                .replace(/[_]/g, " ")
                .replace(/[-]/g, " - ")
                .replace(/(.mp4)/, "")}
            </span>
          ) : (
            <MediaItem
              name={nodes.name
                .replace(/[_]/g, " ")
                .replace(/[-]/g, " - ")
                .replace(/(.mp4)/, "")}
            />
          )
        }
        onClick={
          nodes.children ? null : () => handleClick(nodes.path, nodes.name)
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    </PaddedPaper>
  );

  return (
    <>
      <h2>Library</h2>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["Music"]}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <MediaPanel>
          {library.nodes.children && renderTree(library.nodes)}
        </MediaPanel>
      </TreeView>
    </>
  );
};

MediaLibrary.propTypes = {
  library: libraryPropTypes.library.isRequired,
  handleSelection: PropTypes.func.isRequired,
};

export default MediaLibrary;
