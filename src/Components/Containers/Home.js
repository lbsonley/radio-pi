import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Layout from "../Layouts/Layout";
import Controls from "./Controls";
import { socketPropTypes, queuePropTypes } from "../../prop-types";

const Home = ({ socket, queue }) => {
  const nowPlaying = queue.items[queue.activeIndex];
  
  useEffect(() => { socket.emit("update") }, []);

  return (
    <Layout title="Home">
      <Box
        flex="1 0 50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1">{nowPlaying && nowPlaying.name}</Typography>
      </Box>
      <Controls socket={socket} />
    </Layout>
  );
};

Home.propTypes = {
  socket: socketPropTypes.isRequired,
  queue: queuePropTypes.isRequired
};

export default Home;
