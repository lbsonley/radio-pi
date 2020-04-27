import React from "react";
import Box from "@material-ui/core/Box";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LibraryItem from "../Molecules/LibraryItem";
import Controls from "./Controls";
import Layout from "../Layouts/Layout";
import {
  socketPropTypes,
  libraryPropTypes,
  emitUpdateQueuePropTypes,
} from "../../prop-types";

const Library = ({ socket, library, emitUpdateQueue }) => {
  
  const renderTree = (node) => (
    <Box key={node.name} pt={node.children ? 3 : 2}>
      <TreeItem
        key={node.name}
        nodeId={node.name}
        label={
          node.children ? (
            <span>
              {node.name
                .replace(/[_]/g, " ")
                .replace(/[-]/g, " - ")
                .replace(/(.mp[0-9])/, "")}
            </span>
          ) : (
            <LibraryItem
              emitUpdateQueue={emitUpdateQueue}
              path={node.path}
              name={node.name
                .replace(/[_]/g, " ")
                .replace(/[-]/g, " - ")
                .replace(/(.mp[0-9])/, "")}
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
      <Controls socket={socket} minimum />
    </Layout>
  );
};

Library.propTypes = {
  socket: socketPropTypes.isRequired,
  library: libraryPropTypes.isRequired,
  emitUpdateQueue: emitUpdateQueuePropTypes.isRequired
};

export default Library;
