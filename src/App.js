import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Box from "@material-ui/core/Box";
import io from "socket.io-client";
import ThemeContext from "./Components/Contexts/ThemeContext";
import PlayerContext from "./Components/Contexts/PlayerContext";
import Home from "./Components/Containers/Home";
import Library from "./Components/Containers/Library";
import Queue from "./Components/Containers/Queue";
import Snack from "./Components/Containers/Snack";
import BottomNav from "./Components/Molecules/BottomNav";

const socket = io.connect("http://192.168.0.38:8080");

const App = () => {
  const [library, setLibrary] = useState({});
  const [expanded, setExpanded] = useState(["Artists", "Music"]);
  const [queue, setQueue] = useState({
    items: [],
    activeIndex: 0,
    nowPlaying: null
  });
  const [playerState, setPlayerState] = useState({
    running: false,
    paused: false
  });
   
  const handleToggle = (e, nodeIds) => {
    console.log('nodeIds', nodeIds);
    setExpanded(nodeIds);
  };
  
  const emitUpdateQueue = (payload) => socket.emit("updateQueue", payload);

  useEffect(() => {
    socket.emit("sync");
    socket.on("library", (nodes) => setLibrary(nodes));
    socket.on("queue", (playQueue) => setQueue(playQueue));
    socket.on("playerState", (state) => setPlayerState(state));
  }, []);

  return (
    <ThemeContext>
      <Router>
        <Box
          display="flex"
          flexDirection="column"
          position="relative"
          height={window.innerHeight}
          overflow="hidden"
        >
          <Box flex="1 0 70%" overflow="hidden" position="relative">
            <Snack socket={socket} />
            <PlayerContext.Provider value={playerState}>
              <Switch>
                <Route exact path="/">
                  <Home
                    socket={socket}
                    queue={queue}
                  />
                </Route>
                <Route path="/library">
                  <Library
                    socket={socket}
                    library={library}
                    emitUpdateQueue={emitUpdateQueue}
                    expanded={expanded}
                    handleToggle={handleToggle}
                  />
                </Route>
                <Route path="/queue">
                  <Queue
                    socket={socket}
                    queue={queue}
                    emitUpdateQueue={emitUpdateQueue}
                  />
                </Route>
              </Switch>
            </PlayerContext.Provider>
          </Box>
          <BottomNav style={{ flex: "0 1 auto" }} />
        </Box>
      </Router>
    </ThemeContext>
  );
};

export default App;
