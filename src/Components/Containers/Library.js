import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LibraryItem from "../Molecules/LibraryItem.js";
import Controls from "./Controls";
import Layout from "../Layouts/Layout";

const Library = ({ socket, library }) => {

  const emitQueueUpdate = ({ type, path, name }) =>
    socket.emit("updateQueue", { type, path, name });

  const renderTree = (node) => (
    <Box
      key={node.name}
      pt={!!node.children ? 3 : 2}
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
            <LibraryItem
              emitQueueUpdate={emitQueueUpdate}
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
    </Box>
  );

  return (
    <Layout title="Library">
      <Box flex="1 0 50%" overflow="scroll" mb={2}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["Music"]}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {library.children && renderTree(library)}
        </TreeView>
      </Box>
      <Controls socket={socket} minimum/>
    </Layout>
  );
};

Library.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func,
  }).isRequired,
};

export default Library;
