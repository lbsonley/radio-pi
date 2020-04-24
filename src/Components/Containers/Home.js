import React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Layout from "../Layouts/Layout";
import Controls from "./Controls";

const Home = ({ socket, queue }) => {
  const handleClick = (payload) => {
    socket.emit('control', payload);
  };
  
  const nowPlaying = queue.items[queue.activeIndex];

  return (
    <Layout title="Home">
      <Box
        flex="1 0 50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1">
          {nowPlaying && nowPlaying.name}
        </Typography>
      </Box>
      <Controls socket={socket} />
    </Layout>
  );
};

export default Home;
