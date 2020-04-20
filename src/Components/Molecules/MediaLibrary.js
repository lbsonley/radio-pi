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

// transient props:
// https://github.com/styled-components/styled-components/releases/tag/v5.1.0
const PaddedPaper = styled(Paper)`
  padding-top: ${(props) => (props.$big ? "18px" : "12px")};
  background-color: transparent;
`;

const MediaItem = ({ handleSelection, path, name }) => (
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
        <Button onClick={() => handleSelection({ path, name })}>
          <PlayArrowIcon />
        </Button>
        <Button>
          <QueueMusicIcon />
        </Button>
      </ButtonGroup>
    </Grid>
  </Grid>
);

MediaItem.propTypes = {
  handleSelection: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

const MediaLibrary = ({ library, handleSelection }) => {
  const renderTree = (node) => (
    <PaddedPaper
      key={node.name}
      elevation={0}
      $big={!!node.children}
    >
      <TreeItem
        key={node.name}
        nodeId={node.name}
        label={
          node.children ? (
            <span>
              {node.name
                .replace(/[_]/g, " ")
                .replace(/[-]/g, " - ")
                .replace(/(.mp4)/, "")}
            </span>
          ) : (
            <MediaItem
              handleSelection={handleSelection}
              path={node.path}
              name={node.name
                .replace(/[_]/g, " ")
                .replace(/[-]/g, " - ")
                .replace(/(.mp4)/, "")}
            />
          )
        }
      >
        {Array.isArray(node.children)
          ? node.children.map((child) => renderTree(child))
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
