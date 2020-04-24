import React from "react";
import Box from "@material-ui/core/Box";
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import Layout from "../Layouts/Layout";
import Controls from "./Controls";

const Queue = ({ socket, queue }) => {
  const ClearQueue = () => (
    <IconButton
      onClick={() => socket.emit('updateQueue', { type: 'clear' })}
      color="inherit"
    >
      <DeleteIcon />
    </IconButton>
  );

  return (
    <Layout title="Queue" appBarAction={<ClearQueue />}>
      <Box flex="1 0 50%" overflow="scroll" mb={2}>
        <List>
          {queue.items && queue.items.map((item, index) => (
            <ListItem
              key={`${item.name}${index}`}
              button
              divider
              selected={index === queue.activeIndex}
              onClick={() => console.log('play', index)}
            >
              <ListItemText>{index + 1}. {item.name}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => console.log('remove', index)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
      <Controls socket={socket} minimum />
    </Layout>
  );
};

export default Queue;
