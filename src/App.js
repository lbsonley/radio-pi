import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import io from "socket.io-client";
import Home from "./Components/Containers/Home";
import Library from "./Components/Containers/Library";
import Queue from "./Components/Containers/Queue";
import Snack from "./Components/Containers/Snack";
import BottomNav from "./Components/Molecules/BottomNav";

const socket = io.connect("http://192.168.0.38:8080");

const App = () => {
  const [library, setLibrary] = useState({});
  const [queue, setQueue] = useState({ items: [], activeIndex: 0 });

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    socket.emit("update");
    socket.on("library", (nodes) => setLibrary(nodes));
    socket.on("queue", (playQueue) => setQueue(playQueue));
  }, []);

  const emitUpdateQueue = (payload) => socket.emit("updateQueue", payload);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          position="relative"
          height={window.innerHeight}
          overflow="hidden"
        >
          <Box flex="1 0 70%" overflow="hidden" position="relative">
            <Snack socket={socket} />
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
          </Box>
          <BottomNav style={{ flex: "0 1 auto" }} />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
