import { createContext } from "react";

const PlayerContext = createContext({
    running: false,
    paused: false
});

export default PlayerContext;
